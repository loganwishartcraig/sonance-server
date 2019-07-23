import { ErrorCode } from '@constants/error_codes';
import { IBillParticipant, IBillParticipantConfig, IUser, IBillBody } from '@models';
import { IDatabaseServiceRaw } from '@services/Database';
import { Document, Types } from 'mongoose';
import { ErrorFactoryBase } from '@common/ErrorFactory';

export interface IBillParticipantService {
    addUserViaCode(shareCode: string, user: IUser): Promise<IBillParticipant>;
    resolveConfigForUser(user: IUser): IBillParticipantConfig;
}

/**
 * Choosing how to structure model services for sub-documents in mongoose.
 *   - Incorporate sub-document methods into parent document service class
 *          Pros: easy to do, less complexity, no duplication of bill logic.
 *          Cons: violates SRP in my opinion, can lead to monolith classes.
 *   - Pass loaded Documents via params/constructor
 *          Pros: Decouples the services completely (directly), uses the Document class as a common interface.
 *                Lean classes, and is highly scalable.
 *          Cons: Forces caller to load raw Document classes thus expanding the boundary of the Document class
 *                (doc classes must be public).
 *   - Extend the parent document service class
 *          Pros: All parent document & super class methods are immediately available to the service.
                  Can access & override protected parent class methods. Could expose a different
                  interface so consumers needn't know about the inheritance
            Cons: Tight coupling. The subclass now deeply depends on the super class. We would find it
                  harder to change/remove the super class
 *   - Extend the DatabaseService super-class using the parent document model
            Pros: No direct dependence on the parent document service. Can load
                  raw parent documents & process as needed.
            Cons: Violates DRY in my opinion. Logic for querying parent-documents
                  now exists in two places. Could be hard to maintain or extend.
 *   - Inject the parent document service class
            Pros: Looser coupling than direct extension. Allows parent class implementation to be
                  altered. Easy to implement.
            Cons: Still a level of coupling between the two classes. Restricted to only using
                  public parent class methods, again expanding the boundary because we need the Document class.
            Justification: The class will, no matter what, depend on the Document class. We can define an extended
                  parent class interface that the service will depend on, isolating the rest of the application from
                  the Document class. This allows changing the implementation of the bill service class & the super
                  class (but we would still need to worry about the Document class.)
 */

// How to structure model services for sub-documents in mongoose.
//  - Extend the parent document service class
//      Pros:
//  - Inject the parent document service class
//  -

export interface IBillParticipantServiceConfig {
    billService: IDatabaseServiceRaw<IBillBody>;
    errorFactory: ErrorFactoryBase;
}

export default class BillParticipantService
    implements IBillParticipantService {

    private readonly _billService: IDatabaseServiceRaw<IBillBody>;
    private readonly _errorFactory: ErrorFactoryBase;

    constructor(config: IBillParticipantServiceConfig) {
        this._billService = config.billService;
        this._errorFactory = config.errorFactory;
    }

    public async addUserViaCode(shareCode: string, user: IUser): Promise<IBillParticipant> {

        const bill = await this._billService.loadOneRaw({ shareCode });

        if (!bill) {
            throw this._errorFactory.build(ErrorCode.RECORD_NOT_FOUND, {
                message: 'No bill was found matching the given share code.',
                meta: { shareCode },
            });
        }

        const existingParticipant = this._findParticipant(bill, user._id);

        if (existingParticipant) {
            throw this._errorFactory.build(ErrorCode.RECORD_ALREADY_EXISTS, {
                message: 'The user is already a member of that bill',
                meta: { userId: user._id, billId: bill._id },
            });
        }

        const config = this._resolveParticipantConfig(user);
        const participant = (bill as any).participants.push(config);

        await bill.save();

        return participant;

    }

    public resolveConfigForUser(user: IUser): IBillParticipantConfig {
        return this._resolveParticipantConfig(user);
    }

    private _findParticipant(
        bill: Document,
        userId: string | Types.ObjectId
    ): IBillParticipant | void {

        const [existingParticipant] = (bill as any).participants.filter(
            ({ participant }: IBillParticipant) => participant.equals(userId)
        );

        return existingParticipant;

    }

    private _resolveParticipantConfig(user: IUser, invitedBy?: IUser): IBillParticipantConfig {

        const date = new Date();

        return {
            invitedBy: (invitedBy) ? invitedBy._id : undefined,
            invitedOn: (invitedBy) ? date : undefined,
            joinedOn: date,
            leftOn: undefined,
            participant: user._id,
        };
    }

}
