import { DatabaseService, IDatabaseService, IDatabaseServiceConfig } from '@services/Database';
import { IFriendRequest, IFriendRequestDocument } from '@models';

export interface IFriendRequestService extends IDatabaseService<IFriendRequestDocument, IFriendRequest> {

}

export interface IFriendRequestServiceConfig extends IDatabaseServiceConfig<IFriendRequestDocument> {

}

export class FriendRequestService extends DatabaseService<IFriendRequestDocument, IFriendRequest> {

    constructor(config: IFriendRequestServiceConfig) {
        super(config);
    }

}
