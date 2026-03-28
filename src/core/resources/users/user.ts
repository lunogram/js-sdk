import { BaseResource } from './../base'
import { HttpHandler } from '../../http'
import {
    UpsertUserRequest,
    DeleteUserRequest,
    UserResponse,
} from '../../../types'
import { UserScheduledResource } from './scheduled'
import { UserEventsResource } from './events'

export class UserResource extends BaseResource {
    readonly endpoint = 'users'
    readonly schedule: UserScheduledResource
    readonly events: UserEventsResource

    constructor(http: HttpHandler) {
        super(http)
        this.schedule = new UserScheduledResource(http)
        this.events = new UserEventsResource(http)
    }

    /**
     * Creates or updates a user.
     * @param data - User data including identifier, email, phone, etc.
     * @returns Promise resolving to the created/updated user
     */
    async upsert(data: UpsertUserRequest): Promise<UserResponse> {
        return this.post(data)
    }

    /**
     * Deletes a user by identifier.
     * @param data - Delete request with identifier array
     * @returns Promise resolving when user is deleted
     */
    async delete(data: DeleteUserRequest): Promise<void> {
        return this.remove(data)
    }
}
