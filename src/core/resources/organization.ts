import { BaseResource } from './base'
import {
    OrganizationRequest,
    DeleteOrganizationRequest,
    OrganizationUserRequest,
    RemoveOrganizationUserRequest,
    OrganizationEvent,
    JSONValue,
} from '../../types'

export class OrganizationResource extends BaseResource {
    readonly endpoint = 'organizations'

    async upsert(data: OrganizationRequest) {
        return this.post(data as unknown as Record<string, JSONValue>)
    }

    async delete(data: DeleteOrganizationRequest) {
        return this.remove(data as unknown as Record<string, JSONValue>)
    }

    async addUser(data: OrganizationUserRequest) {
        return this.post({ ...data, action: 'add' } as unknown as Record<string, JSONValue>)
    }

    async removeUser(data: RemoveOrganizationUserRequest) {
        return this.remove(data as unknown as Record<string, JSONValue>)
    }

    async events(data: OrganizationEvent[]) {
        return this.post({ events: data } as unknown as Record<string, JSONValue>)
    }
}
