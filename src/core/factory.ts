import { HttpHandler } from './http'
import { ClientProps } from '../types'
import { UserResource, OrganizationResource } from './resources'

export interface ClientNamespace {
    user: UserResource
    organization: OrganizationResource
}

export function createClientNamespace(http: HttpHandler): ClientNamespace {
    return {
        user: new UserResource(http),
        organization: new OrganizationResource(http),
    }
}

export function createHttpHandler(props: ClientProps): HttpHandler {
    return new HttpHandler(props)
}
