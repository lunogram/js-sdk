import { ClientProps } from '../types'
import { HttpHandler } from './http'
import { createClientNamespace, ClientNamespace } from './factory'

export class Client {
    readonly user: ClientNamespace['user']
    readonly organization: ClientNamespace['organization']
    readonly #http: HttpHandler

    constructor(props: ClientProps) {
        this.#http = new HttpHandler(props)
        const namespace = createClientNamespace(this.#http)
        this.user = namespace.user
        this.organization = namespace.organization
    }

    protected get httpHandler(): HttpHandler {
        return this.#http
    }
}
