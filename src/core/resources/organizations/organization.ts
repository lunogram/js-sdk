import { DeleteOrganizationRequest, OrganizationEvent, OrganizationRequest, OrganizationUserRequest, RemoveOrganizationUserRequest } from "../../../types"
import { BaseResource } from "../base"


export class OrganizationResource extends BaseResource {
    readonly endpoint = 'organizations'

    /**
     * Creates or updates an organization.
     * @param data - Organization data including externalId, name, data, etc.
     * @returns Promise resolving to the created/updated organization
     */
    async upsert(data: OrganizationRequest) {
        return this.post(data)
    }

    /**
     * Deletes an organization by externalId.
     * @param data - Delete request with externalId
     * @returns Promise resolving when organization is deleted
     */
    async delete(data: DeleteOrganizationRequest) {
        return this.remove(data)
    }

    /**
     * Adds a user to an organization.
     * @param data - User assignment data with organizationExternalId and userExternalId
     * @returns Promise resolving when user is added
     */
    async addUser(data: OrganizationUserRequest) {
        return this.post({ ...data, action: 'add' }, 'organizations/users')
    }

    /**
     * Removes a user from an organization.
     * @param data - User removal data with organizationExternalId and userExternalId
     * @returns Promise resolving when user is removed
     */
    async removeUser(data: RemoveOrganizationUserRequest) {
        return this.remove(data, 'organizations/users')
    }

    /**
     * Posts events for an organization.
     * @param data - Array of organization events to post
     * @returns Promise resolving to the API response
     */
    async postEvents(data: OrganizationEvent[]) {
        return this.post(data, 'organizations/events')
    }
}
