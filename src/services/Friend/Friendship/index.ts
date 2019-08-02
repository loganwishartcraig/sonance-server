import { DatabaseService, IDatabaseService, IDatabaseServiceConfig } from '@services/Database';
import { IFriendship, IFriendshipDocument } from '@models';

export interface IFriendshipService extends IDatabaseService<IFriendshipDocument, IFriendship> {

}

export interface IFriendshipServiceConfig extends IDatabaseServiceConfig<IFriendshipDocument> {

}

export class FriendshipService extends DatabaseService<IFriendshipDocument, IFriendship> {

    constructor(config: IFriendshipServiceConfig) {
        super(config);
    }

}
