import { BaseResource } from './../base'
import { HttpHandler } from '../../http'
import {
    UpsertUserRequest,
    DeleteUserRequest,
    UserResponse,
} from '../../../types'
import { UserScheduledResource } from './scheduled'
import { UserEventsResource } from './events'
import { UserInboxResource } from './inbox'

export class UserResource extends BaseResource {
    readonly endpoint = 'users'
    readonly schedule: UserScheduledResource
    readonly events: UserEventsResource
    readonly inbox: UserInboxResource

    constructor(http: HttpHandler) {
        super(http)
        this.schedule = new UserScheduledResource(http)
        this.events = new UserEventsResource(http)
        this.inbox = new UserInboxResource(http)
    }

    /**
     * Creates or updates a user.
     * @param data - User data including identifier, email, phone, etc.
     * @returns Promise resolving to the created/updated user
     */
    async upsert(data: UpsertUserRequest): Promise<UserResponse | undefined> {
        return this.post<UserResponse>(data)
    }

    /**
     * Deletes a user by identifier.
     * @param data - Delete request with identifier array
     * @returns Promise resolving when user is deleted
     */
    async delete(data: DeleteUserRequest): Promise<void> {
        return this.remove<void>(data)
    }
}
