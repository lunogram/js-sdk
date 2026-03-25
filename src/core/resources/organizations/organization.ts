import { BaseResource } from '../base'
import {
    OrganizationRequest,
    DeleteOrganizationRequest,
    OrganizationUserRequest,
    RemoveOrganizationUserRequest,
    OrganizationEvent,
} from '../../../types'

export class OrganizationResource extends BaseResource {
    readonly endpoint = 'organizations'

    async upsert(data: OrganizationRequest) {
        return this.post(data)
    }

    async delete(data: DeleteOrganizationRequest) {
        return this.remove(data)
    }

    async addUser(data: OrganizationUserRequest) {
        return this.post({ ...data, action: 'add' }, 'organizations/users')
    }

    async removeUser(data: RemoveOrganizationUserRequest) {
        return this.remove(data, 'organizations/users')
    }

    async postEvents(data: OrganizationEvent[]) {
        return this.post(data, 'organizations/events')
    }
}