import { OrganizationEvent } from '../../../types'
import { BaseResource } from '../base'

export class OrganizationEventsResource extends BaseResource {
    /**
     * Posts organization events for asynchronous processing.
     * @param data - Array of organization events
     */
    async post<T = unknown>(data: OrganizationEvent[]): Promise<T> {
        return this.call<T>(() =>
            this.client.POST('/api/client/projects/{projectID}/organizations/events', {
                params: this.withProject(),
                body: data as never,
            }),
        )
    }
}
