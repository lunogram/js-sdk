import { BaseResource } from '../base'
import {
    UpsertOrganizationScheduledRequest,
    DeleteOrganizationScheduledRequest,
    ScheduledAcceptedResponse,
} from '../../../types'

/**
 * Resource for managing scheduled organization resources.
 */
export class OrganizationScheduledResource extends BaseResource {
    readonly endpoint = 'organizations/scheduled'

    /**
     * Creates or updates a scheduled resource for an organization.
     * @param data - Scheduled resource data including name, identifier, scheduledAt, interval, etc.
     * @returns Promise resolving to the accepted scheduled resource
     */
    async upsert(data: UpsertOrganizationScheduledRequest): Promise<ScheduledAcceptedResponse> {
        return this.post<ScheduledAcceptedResponse>(data)
    }

    /**
     * Deletes all scheduled instances for an organization with a given resource name.
     * @param data - Delete request with name and identifier
     * @returns Promise resolving when scheduled resource is deleted
     */
    async delete(data: DeleteOrganizationScheduledRequest): Promise<void> {
        return this.remove<void>(data)
    }
}
