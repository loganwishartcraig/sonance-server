import { ErrorFactoryBase } from '@common/ErrorFactory';
import { IFriendRequestService } from './FriendRequest';
import { IFriendshipService } from './Friendship';

export interface IFriendService {

}

export interface IFriendServiceConfig {
    errorFactory: ErrorFactoryBase;
    friendshipService: IFriendshipService;
    friendRequestService: IFriendRequestService;
}

export class FriendService implements IFriendService {

    private readonly _errorFactory: ErrorFactoryBase;
    private readonly _friendshipService: IFriendshipService;
    private readonly _friendRequestService: IFriendRequestService;

    constructor(config: IFriendServiceConfig) {
        this._errorFactory = config.errorFactory;
        this._friendshipService = config.friendshipService;
        this._friendRequestService = config.friendRequestService;
    }

}
