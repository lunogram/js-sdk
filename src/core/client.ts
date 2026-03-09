import { ClientProps, TrackProps, EventProps, IdentifyProps, AliasProps, JSONValue } from '../types'
import { DefaultEndpoint } from './constants'
import { mapKeys } from '../utils'

export class Client {
    #apiKey: string
    #urlEndpoint: string

    constructor(props: ClientProps) {
        this.#apiKey = props.apiKey
        this.#urlEndpoint = props.urlEndpoint ?? DefaultEndpoint
    }

    async track({ properties: data, ...props }: TrackProps) {
        return await this.#request('track', { ...props, data })
    }

    async events(props: EventProps[]) {
        return await this.#request('events', props.map(({ properties: data, ...rest }) => ({ ...rest, data } as Record<string, JSONValue>)))
    }

    async identify({ traits: data, ...props }: IdentifyProps) {
        return await this.#request('identify', { ...props, data })
    }

    async alias(props: AliasProps) {
        return await this.#request('identify', props)
    }

    async #request(path: string, data: Record<string, JSONValue> | Record<string, JSONValue>[]) {
        const request = await fetch(`${this.#urlEndpoint}/client/${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.#apiKey}`,
            },
            body: JSON.stringify(mapKeys(data)),
        })
        return await request.text()
    }
}
