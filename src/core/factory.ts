import { Transport } from './transport'
import { ClientProps } from '../types'
import { UserResource, OrganizationResource, PushResource, SessionResource } from './resources'

export interface ClientNamespace {
    user: UserResource
    organization: OrganizationResource
    push: PushResource
    sessions: SessionResource
}

export function createClientNamespace(transport: Transport): ClientNamespace {
    return {
        user: new UserResource(transport),
        organization: new OrganizationResource(transport),
        push: new PushResource(transport),
        sessions: new SessionResource(transport),
    }
}

export function createTransport(props: ClientProps): Transport {
    return new Transport(props)
}
