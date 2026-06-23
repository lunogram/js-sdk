import { BaseResource } from '../base'
import { Transport } from '../../transport'
import {
    UpsertUserRequest,
    DeleteUserRequest,
    UserResponse,
} from '../../../types'
import { UserScheduledResource } from './scheduled'
import { UserEventsResource } from './events'

export class UserResource extends BaseResource {
    readonly schedule: UserScheduledResource
    readonly events: UserEventsResource

    constructor(transport: Transport) {
        super(transport)
        this.schedule = new UserScheduledResource(transport)
        this.events = new UserEventsResource(transport)
    }

    /**
     * Creates or updates a user.
     * @param data - User data including identifier, email, phone, etc.
     * @returns Promise resolving to the created/updated user
     */
    async upsert(data: UpsertUserRequest): Promise<UserResponse> {
        return this.call<UserResponse>(() =>
            this.client.POST('/api/client/projects/{projectID}/users', {
                params: this.withProject(),
                body: data as never,
            }),
        )
    }

    /**
     * Deletes a user by identifier.
     * @param data - Delete request with identifier array
     * @returns Promise resolving when user is deleted
     */
    async delete(data: DeleteUserRequest): Promise<void> {
        await this.call<void>(() =>
            this.client.DELETE('/api/client/projects/{projectID}/users', {
                params: this.withProject(),
                body: data as never,
            }),
        )
    }
}
