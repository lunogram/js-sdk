import {
    DeleteOrganizationRequest,
    OrganizationRequest,
    OrganizationResponse,
    OrganizationUserRequest,
    RemoveOrganizationUserRequest,
} from "../../../types"
import { BaseResource } from "../base"
import { HttpHandler } from "../../http"
import { OrganizationScheduledResource } from "./scheduled"
import { OrganizationEventsResource } from "./events"

export class OrganizationResource extends BaseResource {
    readonly endpoint = 'organizations'
    readonly schedule: OrganizationScheduledResource
    readonly events: OrganizationEventsResource

    constructor(http: HttpHandler) {
        super(http)
        this.schedule = new OrganizationScheduledResource(http)
        this.events = new OrganizationEventsResource(http)
    }

    /**
     * Creates or updates an organization.
     * @param data - Organization data including identifier, name, data, etc.
     * @returns Promise resolving to the created/updated organization
     */
    async upsert(data: OrganizationRequest): Promise<OrganizationResponse> {
        return this.post<OrganizationResponse>(data)
    }

    /**
     * Deletes an organization by identifier.
     * @param data - Delete request with identifier
     * @returns Promise resolving when organization is deleted
     */
    async delete(data: DeleteOrganizationRequest): Promise<void> {
        return this.remove<void>(data)
    }

    /**
     * Adds a user to an organization.
     * @param data - User assignment data with organization and user identifiers
     * @returns Promise resolving when user is added
     */
    async addUser(data: OrganizationUserRequest): Promise<void> {
        return this.post<void>(data, 'organizations/users')
    }

    /**
     * Removes a user from an organization.
     * @param data - User removal data with organization and user identifiers
     * @returns Promise resolving when user is removed
     */
    async removeUser(data: RemoveOrganizationUserRequest): Promise<void> {
        return this.remove<void>(data, 'organizations/users')
    }
}
