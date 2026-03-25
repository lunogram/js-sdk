import { Client } from '../core/client'
import { ClientProps } from '../types'
import { generateUuid } from '../utils'
import { UserResource } from '../core/resources/users/user'
import { HttpHandler } from '../core/http'
import {
    UpsertUserRequest,
    DeleteUserRequest,
} from '../types'

class BrowserUserResource extends UserResource {
    #anonymousId: string
    #externalId?: string

    constructor(http: HttpHandler) {
        super(http)
        this.#anonymousId = generateUuid()
    }

    #injectIds<T extends { anonymousId?: string; externalId?: string }>(data: T): T {
        this.#externalId = data.externalId ?? this.#externalId
        return {
            ...data,
            anonymousId: data.anonymousId ?? this.#anonymousId,
            externalId: data.externalId ?? this.#externalId,
        }
    }

    async upsert(data: UpsertUserRequest) {
        const injected = this.#injectIds(data)
        return super.upsert(injected)
    }

    async delete(data: DeleteUserRequest) {
        const injected = this.#injectIds(data)
        return super.delete(injected)
    }

    get anonymousId() {
        return this.#anonymousId
    }

    get externalId() {
        return this.#externalId
    }
}

export class BrowserClient extends Client {
    readonly user: BrowserUserResource

    constructor(props: ClientProps) {
        super(props)
        this.user = new BrowserUserResource(super.httpHandler)
    }
}
