import { JSONValue } from './common'
import { UserIdentifier, OrganizationIdentifier } from './request'

/** Request to create or update a scheduled resource for a user */
export interface UpsertUserScheduledRequest {
    /** Id of an existing assignment to update in place. Omit to create a new
     * assignment; the same name may be scheduled multiple times. Returned in the
     * response. */
    id?: string
    name: string
    identifier?: UserIdentifier
    scheduledAt?: string | null
    startAt?: string | null
    interval?: string | null
    data?: Record<string, JSONValue> | null
}

/** Request to delete a user scheduled resource. Provide `id` to delete a single
 * assignment, or `name` to delete every assignment with that name. */
export interface DeleteUserScheduledRequest {
    id?: string
    name?: string
    identifier: UserIdentifier
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
    /** Id of an existing assignment to update in place. Omit to create a new
     * assignment; the same name may be scheduled multiple times. Returned in the
     * response. */
    id?: string
    name: string
    identifier: OrganizationIdentifier
    scheduledAt?: string | null
    startAt?: string | null
    interval?: string | null
    data?: Record<string, JSONValue> | null
}

/** Request to delete an organization scheduled resource. Provide `id` to delete a
 * single assignment, or `name` to delete every assignment with that name. */
export interface DeleteOrganizationScheduledRequest {
    id?: string
    name?: string
    identifier: OrganizationIdentifier
}
