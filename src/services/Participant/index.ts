import { ErrorFactoryBase } from '@common/ErrorFactory';
import { ErrorCode } from '@constants/error_codes';
import { IBillDocument, IParticipantConfig, IParticipantDocument, IUser, IBill, IParticipant } from '@models';
import { Types } from 'mongoose';

export interface IParticipantService {
    create(bill: IBillDocument, user: IUser): Promise<IParticipantDocument>;
    remove(bill: IBillDocument, participantId: string): Promise<void>;
}

/**
 * Choosing how to structure model services for sub-documents in mongoose.
 *   - Incorporate sub-document methods into parent document service class
 *          Pros: easy to do, less complexity, no duplication of bill logic.
 *          Cons: violates SRP in my opinion, can lead to monolith classes.
 *   - Pass loaded Documents via params
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
                  Methods will need to accept parent IDs so they can interact with the contained parent service
            Justification: The class will, no matter what, depend on the Document class. We can define an extended
                  parent class interface that the service will depend on, isolating the rest of the application from
                  the Document class. This allows changing the implementation of the bill service class & the super
                  class (but we would still need to worry about the Document class.)
    - Wrap the parent document in a container class that provides an interface to interact with the sub documents
            Pros: Allows no dependency on the parent document service class. Removes any need
                  to provide extra parent data for method calls.
            Cons: Requires wrapping the loaded document each time using this class. Expands the boundary of the
                  Document class, as each constructor call depends on a loaded Document.
            Mitigation: Could create a factory to isolate consumer from details. Factory
                        could have parent service injected and be responsible for the
                        creation of the class.
    - Use middleware!
*/

// How to structure model services for sub-documents in mongoose.
//  - Extend the parent document service class
//      Pros:
//  - Inject the parent document service class
//  -

export interface IParticipantServiceConfig {
    errorFactory: ErrorFactoryBase;
}

export default class ParticipantService
    implements IParticipantService {

    private readonly _errorFactory: ErrorFactoryBase;

    constructor(config: IParticipantServiceConfig) {
        this._errorFactory = config.errorFactory;
    }

    public async create(bill: IBillDocument, user: IUser): Promise<IParticipantDocument> {

        const existingParticipant = this._findParticipant(bill, user.id);

        if (existingParticipant) {
            throw this._errorFactory.build(ErrorCode.RECORD_ALREADY_EXISTS, {
                message: 'The user is already a member of that bill',
                meta: { userId: user.id, billId: bill._id },
            });
        }

        const config = this._resolveParticipantConfig(user);
        bill.participants.push(config);

        return bill.participants[bill.participants.length - 1];

    }

    public async remove(bill: IBillDocument, participantId: string): Promise<void> {

        const existingParticipant = this._findParticipant(bill, participantId);

        if (existingParticipant) {
            bill.participants = bill.participants.pull(existingParticipant);
        }

    }

    private _findParticipant(
        bill: IBillDocument,
        userId: string | Types.ObjectId
    ): IParticipantDocument | void {

        const [existingParticipant] = bill.participants.filter(
            ({ participant }) => participant.equals(userId)
        );

        return existingParticipant;

    }

    private _resolveParticipantConfig(user: IUser, invitedBy?: IUser): IParticipantConfig {

        const date = new Date();

        return {
            invitedBy: (invitedBy) ? invitedBy.id : undefined,
            invitedOn: (invitedBy) ? date : undefined,
            joinedOn: date,
            leftOn: undefined,
            participant: user.id,
        };
    }

}
