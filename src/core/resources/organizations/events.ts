import { OrganizationEvent } from "../../../types"
import { BaseResource } from "../base"


export class OrganizationEventsResource extends BaseResource {
    readonly endpoint = 'organizations/events'

    async post<T = unknown>(data: OrganizationEvent[]): Promise<T> {
        return super.post(data)
    }
}