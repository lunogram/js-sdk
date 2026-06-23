import {
    DeleteOrganizationRequest,
    OrganizationRequest,
    OrganizationResponse,
    OrganizationUserRequest,
    RemoveOrganizationUserRequest,
} from '../../../types'
import { BaseResource } from '../base'
import { Transport } from '../../transport'
import { OrganizationScheduledResource } from './scheduled'
import { OrganizationEventsResource } from './events'

export class OrganizationResource extends BaseResource {
    readonly schedule: OrganizationScheduledResource
    readonly events: OrganizationEventsResource

    constructor(transport: Transport) {
        super(transport)
        this.schedule = new OrganizationScheduledResource(transport)
        this.events = new OrganizationEventsResource(transport)
    }

    /**
     * Creates or updates an organization.
     * @param data - Organization data including identifier, name, data, etc.
     * @returns Promise resolving to the created/updated organization
     */
    async upsert(data: OrganizationRequest): Promise<OrganizationResponse> {
        return this.call<OrganizationResponse>(() =>
            this.client.POST('/api/client/projects/{projectID}/organizations', {
                params: this.withProject(),
                body: data as never,
            }),
        )
    }

    /**
     * Deletes an organization by identifier.
     * @param data - Delete request with identifier
     * @returns Promise resolving when organization is deleted
     */
    async delete(data: DeleteOrganizationRequest): Promise<void> {
        await this.call<void>(() =>
            this.client.DELETE('/api/client/projects/{projectID}/organizations', {
                params: this.withProject(),
                body: data as never,
            }),
        )
    }

    /**
     * Adds a user to an organization.
     * @param data - User assignment data with organization and user identifiers
     * @returns Promise resolving when user is added
     */
    async addUser(data: OrganizationUserRequest): Promise<void> {
        await this.call<void>(() =>
            this.client.POST('/api/client/projects/{projectID}/organizations/users', {
                params: this.withProject(),
                body: data as never,
            }),
        )
    }

    /**
     * Removes a user from an organization.
     * @param data - User removal data with organization and user identifiers
     * @returns Promise resolving when user is removed
     */
    async removeUser(data: RemoveOrganizationUserRequest): Promise<void> {
        await this.call<void>(() =>
            this.client.DELETE('/api/client/projects/{projectID}/organizations/users', {
                params: this.withProject(),
                body: data as never,
            }),
        )
    }
}
