import { JSONValue } from './common'

/** An external identifier with source and optional metadata */
export interface ExternalID {
    /** Source of the identifier (e.g. "default", "anonymous", or a custom source). Defaults to "default" if not provided. */
    source?: string
    /** The external identifier value */
    externalId: string
    /** Optional metadata associated with this identifier */
    metadata?: Record<string, JSONValue> | null
}

/** An external identifier as returned in responses */
export interface ExternalIDResponse {
    id: string
    source: string
    externalId: string
    metadata?: Record<string, JSONValue> | null
    createdAt: string
    updatedAt: string
}

/** One or more external identifiers to identify a user */
export type UserIdentifier = ExternalID[]

/** One or more external identifiers to identify an organization */
export type OrganizationIdentifier = ExternalID[]

/** Request to create or update a user */
export interface UpsertUserRequest {
    identifier: UserIdentifier
    email?: string | null
    phone?: string | null
    timezone?: string | null
    locale?: string | null
    data?: Record<string, JSONValue> | null
}

/** Request to delete a user */
export interface DeleteUserRequest {
    identifier: UserIdentifier
}

/** User response from the API */
export interface UserResponse {
    id: string
    projectId: string
    identifier: ExternalIDResponse[]
    email?: string
    phone?: string
    data: Record<string, JSONValue>
    timezone?: string
    locale?: string
    hasPushDevice: boolean
    version: number
    createdAt: string
    updatedAt: string
}

/** Event data for user events */
export interface UserEvent {
    name: string
    /** User identifier array. Mutually exclusive with `match`. */
    identifier?: UserIdentifier
    /**
     * JSONB containment filter to match users by their data attributes.
     * Mutually exclusive with `identifier`. When set, the event is delivered
     * to every user whose data column contains the given key/value pairs.
     */
    match?: Record<string, JSONValue> | null
    data: Record<string, JSONValue>
}

/** Request to create or update an organization */
export interface OrganizationRequest {
    identifier: OrganizationIdentifier
    name?: string | null
    data?: Record<string, JSONValue> | null
}

/** Organization response from the API */
export interface OrganizationResponse {
    id: string
    projectId: string
    identifier: ExternalIDResponse[]
    name?: string
    data: Record<string, JSONValue>
    version: number
    createdAt: string
    updatedAt: string
}

/** Request to delete an organization */
export interface DeleteOrganizationRequest {
    identifier: OrganizationIdentifier
}

/** Request to add a user to an organization */
export interface OrganizationUserRequest {
    organization: {
        identifier: OrganizationIdentifier
    }
    user: {
        identifier: UserIdentifier
    }
    data?: Record<string, JSONValue> | null
}

/** Request to remove a user from an organization */
export interface RemoveOrganizationUserRequest {
    organization: {
        identifier: OrganizationIdentifier
    }
    user: {
        identifier: UserIdentifier
    }
}

// Inbox types

export type InboxStatus = 'unread' | 'opened' | 'archived'

/** Request to create inbox messages */
export interface PostInboxMessagesRequest {
    source: string
    externalId: string
    messages: Record<string, JSONValue>[]
}

/** Request to mark inbox messages as opened or archived */
export interface InboxMessageEvents {
    source: string
    externalId: string
    messageIds: string[]
}

/** Query params for fetching inbox messages */
export interface GetInboxParams {
    source: string
    externalId: string
    channel: string
    status?: InboxStatus
    tags?: string
    messageSource?: string
    priority?: number
    limit?: number
    offset?: number
}

/** Query params for counting inbox messages */
export interface GetInboxCountParams {
    source: string
    externalId: string
    channel: string
}

/** A single inbox message as returned by the API */
export interface InboxMessage {
    id: string
    data: Record<string, JSONValue>
    status: InboxStatus
    channel: string
    priority: number
    tags: string[]
    createdAt: string
    updatedAt: string
}

/** Paginated list of inbox messages */
export interface InboxMessageList {
    data: InboxMessage[]
    total: number
}

/** Inbox message counts */
export interface InboxCount {
    unread: number
    total: number
}

/** Event data for organization events */
export interface OrganizationEvent {
    /** Organization identifier array. Mutually exclusive with `match`. */
    identifier?: OrganizationIdentifier
    /**
     * JSONB containment filter to match organizations by their data attributes.
     * Mutually exclusive with `identifier`. When set, the event is delivered
     * to every organization whose data column contains the given key/value pairs.
     */
    match?: Record<string, JSONValue> | null
    name: string
    data?: Record<string, JSONValue> | null
}
