import { OrganizationEvent } from "../../../types"
import { BaseResource } from "../base"

export class OrganizationEventsResource extends BaseResource {
    readonly endpoint = 'organizations/events'

    /**
     * Posts organization events for asynchronous processing.
     * @param data - Array of organization events
     */
    async post<T = unknown>(data: OrganizationEvent[]): Promise<T> {
        return super.post(data)
    }
}
