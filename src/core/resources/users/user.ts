import { BaseResource } from '../base'
import {
    UpsertUserRequest,
    DeleteUserRequest,
    UserEvent,
} from '../../../types'

export class UserResource extends BaseResource {
    readonly endpoint = 'users'

    async upsert(data: UpsertUserRequest) {
        return this.post(data)
    }

    async delete(data: DeleteUserRequest) {
        return this.remove(data)
    }

    async postEvents(data: UserEvent[]) {
        return this.post(data, 'users/events')
    }
}