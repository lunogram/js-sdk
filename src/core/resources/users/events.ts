import { UserEvent } from "../../../types"
import { BaseResource } from "../base"

export class UserEventsResource extends BaseResource {
    readonly endpoint = 'users/events'

    /**
     * Posts user events for asynchronous processing.
     * @param data - Array of user events
     */
    async post<T = unknown>(data: UserEvent[]): Promise<T> {
        return super.post<T>(data)
    }
}
