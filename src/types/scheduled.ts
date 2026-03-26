import { JSONValue } from './common'

export interface CreateUserScheduledRequest {
    name: string
    externalId?: string
    anonymousId?: string
    scheduledAt: string
    startAt?: string
    interval: string
    data?: Record<string, JSONValue>
}

export interface DeleteUserScheduledRequest {
    name: string
    externalId?: string
    anonymousId?: string
}

export interface UserScheduledResponse {
    id: string
    name: string
    scheduledAt: string
    data: Record<string, JSONValue> | null
}

export interface CreateOrganizationScheduledRequest {
    name: string
    organizationExternalId: string
    scheduledAt: string
    startAt?: string
    interval: string
    data?: Record<string, JSONValue>
}

export interface DeleteOrganizationScheduledRequest {
    name: string
    organizationExternalId: string
}

export interface OrganizationScheduledResponse {
    id: string
    name: string
    scheduledAt: string
    data: Record<string, JSONValue> | null
}