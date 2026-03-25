import { BaseResource } from '../base'
import {
    CreateUserScheduledRequest,
    DeleteUserScheduledRequest,
    UserScheduledResponse,
} from '../../../types'

/**
 * Resource for managing scheduled user tasks.
 */
export class UserScheduledResource extends BaseResource {
    readonly endpoint = 'users/scheduled'

    /**
     * Creates a scheduled task for a user.
     * @param data - Scheduled task data including name, externalId, scheduledAt, interval, etc.
     * @returns Promise resolving to the created scheduled task
     */
    async create(data: CreateUserScheduledRequest): Promise<UserScheduledResponse> {
        return this.post(data)
    }

    /**
     * Deletes a scheduled task by name and user identifiers.
     * @param data - Delete request with name and externalId or anonymousId
     * @returns Promise resolving when scheduled task is deleted
     */
    async delete(data: DeleteUserScheduledRequest): Promise<void> {
        return this.remove(data)
    }
}