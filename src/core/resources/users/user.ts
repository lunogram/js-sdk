import { BaseResource } from './../base'
import { HttpHandler } from '../../http'
import {
    UpsertUserRequest,
    DeleteUserRequest,
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
}
