import { BaseResource } from '../base'
import {
    UpsertUserScheduledRequest,
    DeleteUserScheduledRequest,
    ScheduledAcceptedResponse,
} from '../../../types'

/**
 * Resource for managing scheduled user resources.
 */
export class UserScheduledResource extends BaseResource {
    readonly endpoint = 'users/scheduled'

    /**
     * Creates or updates a scheduled resource for a user.
     * @param data - Scheduled resource data including name, identifier, scheduledAt, interval, etc.
     * @returns Promise resolving to the accepted scheduled resource
     */
    async upsert(data: UpsertUserScheduledRequest): Promise<ScheduledAcceptedResponse> {
        return this.post<ScheduledAcceptedResponse>(data)
    }

    /**
     * Deletes all scheduled instances for a user with a given resource name.
     * @param data - Delete request with name and identifier
     * @returns Promise resolving when scheduled resource is deleted
     */
    async delete(data: DeleteUserScheduledRequest): Promise<void> {
        return this.remove<void>(data)
    }
}
