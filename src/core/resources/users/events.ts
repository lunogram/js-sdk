import { UserEvent } from "../../../types"
import { BaseResource } from "../base"


export class UserEventsResource extends BaseResource {
    readonly endpoint = 'users/events'

    async post<T = unknown>(data: UserEvent[]): Promise<T> {
        return super.post(data)
    }
}