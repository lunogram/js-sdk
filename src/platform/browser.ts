import { Client } from '../core/client'
import { ClientProps, TrackProps, EventProps, IdentifyProps, AliasProps } from '../types'
import { generateUuid } from '../utils'

export class BrowserClient extends Client {
    #anonymousId: string = generateUuid()
    #externalId?: string
    #client: Client

    constructor(props: ClientProps) {
        super(props)
        this.#client = new Client(props)
    }

    async track(props: TrackProps) {
        return await this.#client.track({
            ...props,
            anonymousId: props.anonymousId ?? this.#anonymousId,
            externalId: props.externalId ?? this.#externalId,
        })
    }

    async events(props: EventProps[]) {
        return await this.#client.events(props.map((event) => {
            return {
                ...event,
                anonymousId: event.anonymousId ?? this.#anonymousId,
                externalId: event.externalId ?? this.#externalId,
            }
        }))
    }

    async identify(props: IdentifyProps) {
        this.#externalId = props.externalId
        return await this.#client.identify({
            ...props,
            anonymousId: props.anonymousId ?? this.#anonymousId,
            externalId: props.externalId ?? this.#externalId,
        })
    }

    async alias(props: AliasProps) {
        this.#externalId = props.externalId
        return await this.#client.alias(props)
    }
}
