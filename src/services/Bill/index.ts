import { ErrorCode } from '@constants/error_codes';
import {
    IBillBody,
    IBillBodyConfig,
    IBIllBodyUpdateConfig,
    IBillParticipant,
    IBillParticipantConfig
} from '@models';
import { DatabaseService, IDatabaseService, IDatabaseServiceConfig } from '@services/Database';
import { Types } from 'mongoose';

export interface IBillService extends IDatabaseService<IBillBody, IBillBodyConfig> {
    getByCreatorId(userId: string): Promise<IBillBody[]>;
    getById(billId: string): Promise<IBillBody | void>;
    getByShareCode(shareCode: string): Promise<IBillBody | void>;
    removeById(billId: string | Types.ObjectId): Promise<void>;
    insertParticipants(billId: string | Types.ObjectId, configs: IBillParticipantConfig[]): Promise<IBillParticipant[]>;
    updateBill(billId: string | Types.ObjectId, updates: IBIllBodyUpdateConfig): Promise<IBillBody | void>;
}
export type IBillServiceConfig = IDatabaseServiceConfig<IBillBody>;

export class BillService
    extends DatabaseService<IBillBody, IBillBodyConfig>
    implements IBillService {

    constructor(config: IBillServiceConfig) {
        super(config);
    }

    public async getByCreatorId(userId: string): Promise<IBillBody[]> {
        return this.find({ createdBy: userId });
    }

    public async getById(billId: string): Promise<IBillBody | void> {
        return this.findOne({ _id: billId });
    }

    public async getByShareCode(shareCode: string): Promise<IBillBody | void> {
        return this.findOne({ shareCode });
    }

    public async removeById(billId: string | Types.ObjectId): Promise<void> {
        return this.removeOne({ _id: billId });
    }

    public async updateBill(
        billId: string | Types.ObjectId,
        updates: IBIllBodyUpdateConfig
    ): Promise<IBillBody | void> {

        // TODO: Remove this any cast here
        return await this.updateOne({ _id: billId as any }, updates);

    }

    public async insertParticipants(
        billId: string | Types.ObjectId,
        configs: IBillParticipantConfig[]
    ): Promise<IBillParticipant[]> {

        const bill = await this.loadOneRaw({ _id: billId });

        if (!bill) {
            throw this._errorFactory.build(ErrorCode.RECORD_NOT_FOUND);
        }

        const sliceStart = (bill as any).participants.length;

        (bill as any).participants.push(...configs);

        const participants = (bill as any).participants.slice(sliceStart);

        await bill.save();

        return participants;

    }

}
