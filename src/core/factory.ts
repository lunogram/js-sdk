import { Transport } from './transport'
import { ClientProps } from '../types'
import { UserResource, OrganizationResource } from './resources'

export interface ClientNamespace {
    user: UserResource
    organization: OrganizationResource
}

export function createClientNamespace(transport: Transport): ClientNamespace {
    return {
        user: new UserResource(transport),
        organization: new OrganizationResource(transport),
    }
}

export function createTransport(props: ClientProps): Transport {
    return new Transport(props)
}
