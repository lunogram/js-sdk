import { JSONValue } from './common'
import { ExternalID, UserIdentifier, OrganizationIdentifier } from './request'

/** Delivery channel for an inbox message. */
export type Channel = 'email' | 'sms' | 'push' | 'inbox'

/** Visibility status used to filter inbox queries. */
export type InboxStatus = 'unread' | 'read' | 'archived'

/** Fields shared by user and organization inbox message creation. */
interface InboxMessageCreateBase {
    /** External identifier for the message. Required for idempotency and traceability back to the origin source. */
    identifier: ExternalID
    channel: Channel
    /** Required for email and sms messages. Push uses project push provider settings. */
    senderIdentityId?: string | null
    campaignId?: string | null
    broadcastId?: string | null
    /** Channel-specific payload content. */
    content?: Record<string, JSONValue> | null
    data?: Record<string, JSONValue> | null
    tags?: string[]
    /** Message priority from 1 (highest) to 5 (lowest). Defaults to 3. */
    priority?: number
    source?: string | null
    scheduledAt?: string | null
    expiresAt?: string | null
}

/** Request to create an inbox message for a user. */
export interface InboxMessageCreate extends InboxMessageCreateBase {
    target: UserIdentifier
}

/** Request to create an inbox message for an organization. */
export interface OrganizationInboxMessageCreate extends InboxMessageCreateBase {
    target: OrganizationIdentifier
}

/** An inbox message as returned by the API. */
export interface InboxMessage {
    id: string
    projectId: string
    userId?: string
    organizationId?: string
    /** External identifier for the message, if one was provided at creation time. */
    externalId?: string | null
    channel: Channel
    senderIdentityId?: string | null
    campaignId?: string | null
    broadcastId?: string | null
    content: Record<string, JSONValue>
    data: Record<string, JSONValue>
    tags: string[]
    priority: number
    source?: string | null
    scheduledAt: string
    expiresAt?: string | null
    readAt?: string | null
    archivedAt?: string | null
    sentAt?: string | null
    createdAt: string
    updatedAt: string
}

/** A paginated list of inbox messages. */
export interface InboxMessageList {
    results: InboxMessage[]
    total: number
    limit: number
    offset: number
}

/** Unread and total visible message counts for an inbox. */
export interface InboxCount {
    unread: number
    total: number
}

/** Reference to a single user inbox message, used by read/archive operations. */
export interface UserInboxMessageRef {
    target: UserIdentifier
    messageId: string
}

/** Reference to a single organization inbox message, used by read/archive operations. */
export interface OrganizationInboxMessageRef {
    target: OrganizationIdentifier
    messageId: string
}

/** Filter for querying an inbox. `source`, `externalId` and `channel` are required. */
export interface InboxQuery {
    source: string
    externalId: string
    channel: Channel
    status?: InboxStatus
    /** Comma-separated tag filter. All listed tags must be present. */
    tags?: string
    messageSource?: string
    priority?: number
    limit?: number
    offset?: number
}

/** Filter for counting inbox messages. All fields are required. */
export interface InboxCountQuery {
    source: string
    externalId: string
    channel: Channel
}
