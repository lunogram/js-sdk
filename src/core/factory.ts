import { HttpHandler } from './http'
import { ClientProps } from '../types'
import { UserResource, UserScheduledResource, OrganizationResource, OrganizationScheduledResource } from './resources'

export interface ClientNamespace {
    user: UserResource
    userScheduled: UserScheduledResource
    organization: OrganizationResource
    organizationScheduled: OrganizationScheduledResource
}

export function createClientNamespace(http: HttpHandler): ClientNamespace {
    return {
        user: new UserResource(http),
        userScheduled: new UserScheduledResource(http),
        organization: new OrganizationResource(http),
        organizationScheduled: new OrganizationScheduledResource(http),
    }
}

export function createHttpHandler(props: ClientProps): HttpHandler {
    return new HttpHandler(props)
}
