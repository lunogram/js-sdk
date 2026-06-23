import { UserEvent } from '../../../types'
import { BaseResource } from '../base'

export class UserEventsResource extends BaseResource {
    /**
     * Posts user events for asynchronous processing.
     * @param data - Array of user events
     */
    async post<T = unknown>(data: UserEvent[]): Promise<T> {
        return this.call<T>(() =>
            this.client.POST('/api/client/projects/{projectID}/users/events', {
                params: this.withProject(),
                body: data as never,
            }),
        )
    }
}
