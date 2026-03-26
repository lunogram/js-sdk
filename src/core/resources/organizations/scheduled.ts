import { BaseResource } from '../base'
import {
    CreateOrganizationScheduledRequest,
    DeleteOrganizationScheduledRequest,
    OrganizationScheduledResponse,
} from '../../../types'

/**
 * Resource for managing scheduled organization tasks.
 */
export class OrganizationScheduledResource extends BaseResource {
    readonly endpoint = 'organizations/scheduled'

    /**
     * Creates a scheduled task for an organization.
     * @param data - Scheduled task data including name, organizationExternalId, scheduledAt, interval, etc.
     * @returns Promise resolving to the created scheduled task
     */
    async create(data: CreateOrganizationScheduledRequest): Promise<OrganizationScheduledResponse> {
        return this.post(data)
    }

    /**
     * Deletes a scheduled task by name and organization external ID.
     * @param data - Delete request with name and organizationExternalId
     * @returns Promise resolving when scheduled task is deleted
     */
    async delete(data: DeleteOrganizationScheduledRequest): Promise<void> {
        return this.remove(data)
    }
}