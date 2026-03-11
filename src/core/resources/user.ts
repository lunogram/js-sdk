import { BaseResource } from './base'
import {
    UpsertUserRequest,
    DeleteUserRequest,
    UserEvent,
    JSONValue,
} from '../../types'

export class UserResource extends BaseResource {
    readonly endpoint = 'users'

    async upsert(data: UpsertUserRequest) {
        return this.post(data as unknown as Record<string, JSONValue>)
    }

    async delete(data: DeleteUserRequest) {
        return this.remove(data as unknown as Record<string, JSONValue>)
    }

    async events(data: UserEvent[]) {
        return this.post({ events: data } as unknown as Record<string, JSONValue>)
    }

    async track(data: UserEvent) {
        return this.events([data])
    }
}
