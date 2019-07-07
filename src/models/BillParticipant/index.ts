import { IUser } from '../User';

export default interface IBillParticipant {
    readonly _id: string;
    readonly participant: IUser;
    readonly joinedOn: Date;
    readonly invitedBy: IUser | void;
    readonly invitedOn: Date | void;
    readonly leftOn: Date | void;
}
