import { BaseResource } from '../base'
import {
    CreateOrganizationScheduledRequest,
    DeleteOrganizationScheduledRequest,
    OrganizationScheduledResponse,
} from '../../../types'

export class OrganizationScheduledResource extends BaseResource {
    readonly endpoint = 'organizations/scheduled'

    async create(data: CreateOrganizationScheduledRequest): Promise<OrganizationScheduledResponse> {
        return this.post(data)
    }

    async delete(data: DeleteOrganizationScheduledRequest): Promise<void> {
        return this.remove(data)
    }
}