import { JSONValue } from './common'
import { UserIdentifier, OrganizationIdentifier } from './request'

/** Request to create or update a scheduled resource for a user */
export interface UpsertUserScheduledRequest {
    name: string
    identifier?: UserIdentifier
    scheduledAt?: string | null
    startAt?: string | null
    interval?: string | null
    data?: Record<string, JSONValue> | null
}

/** Request to delete a user scheduled resource */
export interface DeleteUserScheduledRequest {
    name: string
    identifier?: UserIdentifier
}

/** Response when a scheduled resource is accepted */
export interface ScheduledAcceptedResponse {
    id: string
    name: string
    scheduledAt: string
    data?: Record<string, JSONValue> | null
}

/** Request to create or update a scheduled resource for an organization */
export interface UpsertOrganizationScheduledRequest {
    name: string
    identifier: OrganizationIdentifier
    scheduledAt?: string | null
    startAt?: string | null
    interval?: string | null
    data?: Record<string, JSONValue> | null
}

/** Request to delete an organization scheduled resource */
export interface DeleteOrganizationScheduledRequest {
    name: string
    identifier: OrganizationIdentifier
}
