import { JSONValue } from './common'

export interface UpsertUserRequest {
    externalId?: string
    anonymousId?: string
    email?: string
    phone?: string
    timezone?: string
    locale?: string
    data?: Record<string, JSONValue>
}

export interface DeleteUserRequest {
    externalId?: string
    anonymousId?: string
}

export interface UserEvent {
    name: string
    anonymousId?: string
    externalId?: string
    data: Record<string, JSONValue>
}

export interface OrganizationRequest {
    externalId: string
    name?: string
    data?: Record<string, JSONValue>
}

export interface DeleteOrganizationRequest {
    externalId: string
}

export interface OrganizationUserRequest {
    organizationExternalId: string
    userExternalId: string
    data?: Record<string, JSONValue>
}

export interface RemoveOrganizationUserRequest {
    organizationExternalId: string
    userExternalId: string
}

export interface OrganizationEvent {
    organizationExternalId: string
    name: string
    data?: Record<string, JSONValue>
}
