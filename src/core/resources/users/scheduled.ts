import { BaseResource } from '../base'
import {
    CreateUserScheduledRequest,
    DeleteUserScheduledRequest,
    UserScheduledResponse,
} from '../../../types'

export class UserScheduledResource extends BaseResource {
    readonly endpoint = 'users/scheduled'

    async create(data: CreateUserScheduledRequest): Promise<UserScheduledResponse> {
        return this.post(data)
    }

    async delete(data: DeleteUserScheduledRequest): Promise<void> {
        return this.remove(data)
    }
}