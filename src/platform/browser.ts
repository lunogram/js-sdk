import { Client } from '../core/client'
import { ClientProps, ExternalID } from '../types'
import { generateUuid } from '../utils'
import { UserResource } from '../core/resources/users/user'
import { Transport } from '../core/transport'
import {
    UpsertUserRequest,
    DeleteUserRequest,
    UserResponse,
    UserEvent,
    UserIdentifier,
    UpsertUserScheduledRequest,
    DeleteUserScheduledRequest,
    ScheduledAcceptedResponse,
    DeviceRegistration,
} from '../types'
import { UserEventsResource } from '../core/resources/users/events'
import { UserScheduledResource } from '../core/resources/users/scheduled'
import { UserDevicesResource } from '../core/resources/users/devices'

class BrowserUserEventsResource extends UserEventsResource {
    readonly #getIdentifier: () => UserIdentifier

    constructor(transport: Transport, getIdentifier: () => UserIdentifier) {
        super(transport)
        this.#getIdentifier = getIdentifier
    }

    async post<T = unknown>(data: UserEvent[]): Promise<T> {
        const identifier = this.#getIdentifier()
        const injected = data.map((event) => ({
            ...event,
            // Do not inject identifier when `match` is used (they are mutually exclusive)
            identifier: event.match ? event.identifier : (event.identifier ?? identifier),
        }))
        return super.post(injected) as Promise<T>
    }
}

class BrowserUserScheduledResource extends UserScheduledResource {
    readonly #getIdentifier: () => UserIdentifier

    constructor(transport: Transport, getIdentifier: () => UserIdentifier) {
        super(transport)
        this.#getIdentifier = getIdentifier
    }

    async upsert(data: UpsertUserScheduledRequest): Promise<ScheduledAcceptedResponse> {
        return super.upsert({
            ...data,
            identifier: data.identifier ?? this.#getIdentifier(),
        })
    }

    async delete(data: DeleteUserScheduledRequest): Promise<void> {
        return super.delete({
            ...data,
            identifier: data.identifier ?? this.#getIdentifier(),
        })
    }
}

class BrowserUserDevicesResource extends UserDevicesResource {
    readonly #getIdentifier: () => UserIdentifier

    constructor(transport: Transport, getIdentifier: () => UserIdentifier) {
        super(transport)
        this.#getIdentifier = getIdentifier
    }

    async register(data: DeviceRegistration): Promise<void> {
        return super.register({
            ...data,
            identifier: data.identifier ?? this.#getIdentifier(),
        })
    }
}

class BrowserUserResource extends UserResource {
    readonly #anonymousId: string
    /**
     * Sticky external ID captured from the first upsert/delete call that includes
     * an identifier with source "default" (or no source). Once set, it is
     * automatically included in every subsequent identifier array so the server
     * can correlate anonymous and identified sessions.
     */
    #externalId?: string
    override readonly events: BrowserUserEventsResource
    override readonly schedule: BrowserUserScheduledResource
    override readonly devices: BrowserUserDevicesResource

    constructor(transport: Transport) {
        super(transport)
        this.#anonymousId = generateUuid()
        this.events = new BrowserUserEventsResource(transport, () => this.#buildIdentifier())
        this.schedule = new BrowserUserScheduledResource(transport, () => this.#buildIdentifier())
        this.devices = new BrowserUserDevicesResource(transport, () => this.#buildIdentifier())
    }

    #buildIdentifier(extraIdentifiers?: UserIdentifier): UserIdentifier {
        const identifier: ExternalID[] = [
            { source: 'anonymous', externalId: this.#anonymousId },
        ]

        // Include the sticky external ID if set
        if (this.#externalId) {
            identifier.push({ source: 'default', externalId: this.#externalId })
        }

        // Merge any additional identifiers from the caller
        if (extraIdentifiers) {
            for (const id of extraIdentifiers) {
                const normalizedSource = id.source ?? 'default'

                // Avoid duplicating identifiers already present
                const exists = identifier.some(
                    (existing) => existing.source === normalizedSource && existing.externalId === id.externalId,
                )
                if (!exists) {
                    identifier.push({ ...id, source: normalizedSource })
                }
            }

            // Persist sticky ID *after* building the full array
            const defaultId = extraIdentifiers.find(
                (id) => !id.source || id.source === 'default',
            )
            if (defaultId) {
                this.#externalId = defaultId.externalId
            }
        }

        return identifier
    }

    async upsert(data: UpsertUserRequest): Promise<UserResponse> {
        const identifier = this.#buildIdentifier(data.identifier)
        return super.upsert({ ...data, identifier })
    }

    async delete(data: DeleteUserRequest): Promise<void> {
        const identifier = this.#buildIdentifier(data.identifier)
        return super.delete({ ...data, identifier })
    }

    /** The auto-generated anonymous ID for this browser session */
    get anonymousId() {
        return this.#anonymousId
    }

    /** The sticky external ID, set from the first identify call that includes a "default" source identifier */
    get externalId() {
        return this.#externalId
    }
}

export class BrowserClient extends Client {
    readonly user: BrowserUserResource

    constructor(props: ClientProps) {
        super(props)
        this.user = new BrowserUserResource(super.transport)
    }
}
