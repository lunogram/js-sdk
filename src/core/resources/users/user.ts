import { BaseResource } from './../base'
import { HttpHandler } from '../../http'
import {
    UpsertUserRequest,
    DeleteUserRequest,
    UserEvent,
} from '../../../types'
import { UserScheduledResource } from './scheduled'

export class UserResource extends BaseResource {
    readonly endpoint = 'users'
    readonly schedule: UserScheduledResource

    constructor(http: HttpHandler) {
        super(http)
        this.schedule = new UserScheduledResource(http)
    }

    /**
     * Creates or updates a user.
     * @param data - User data including email, externalId, phone, etc.
     * @returns Promise resolving to the created/updated user
     */
    async upsert(data: UpsertUserRequest) {
        return this.post(data)
    }

    /**
     * Deletes a user by externalId or anonymousId.
     * @param data - Delete request with externalId or anonymousId
     * @returns Promise resolving when user is deleted
     */
    async delete(data: DeleteUserRequest) {
        return this.remove(data)
    }

    /**
     * Posts events for a user.
     * @param data - Array of user events to post
     * @returns Promise resolving to the API response
     */
    async postEvents(data: UserEvent[]) {
        return this.post(data, 'users/events')
    }
}
