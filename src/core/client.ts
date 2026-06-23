import { ClientProps } from '../types'
import { Transport } from './transport'
import { createClientNamespace, ClientNamespace } from './factory'

export class Client {
    readonly user: ClientNamespace['user']
    readonly organization: ClientNamespace['organization']
    readonly #transport: Transport

    constructor(props: ClientProps) {
        this.#transport = new Transport(props)
        const namespace = createClientNamespace(this.#transport)
        this.user = namespace.user
        this.organization = namespace.organization
    }

    protected get transport(): Transport {
        return this.#transport
    }
}
