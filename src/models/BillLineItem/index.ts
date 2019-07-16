import { Types } from 'mongoose';

export interface IBillLineItem {
    readonly _id: Types.ObjectId;
    readonly createdBy: Types.ObjectId;
    readonly createdOn: Date;
    readonly claimedBy: Types.ObjectId | void;
    readonly claimedOn: Date | void;
    readonly deletedOn: Date | void;
    readonly isShared: boolean;
    readonly quantity: number;
    readonly price: number;
}

export type IBillLineItemConfig = Omit<IBillLineItem, '_id' | 'createdOn'>;

export class BillLineItem {

    public static toConfig({ _id, ...lineConfig }: IBillLineItem): IBillLineItemConfig {
        return lineConfig;
    }

    public static split(line: IBillLineItem, ways: number): IBillLineItemConfig[] {

        const price = line.price / ways;
        const splitLines: IBillLineItemConfig[] = [];

        for (let i = 0; i < ways; i++) {
            splitLines.push(this.toConfig({ ...line, price }));
        }

        return splitLines;

    }

}
