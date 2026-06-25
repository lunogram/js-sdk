import { BaseResource } from '../base'
import {
    OrganizationInboxMessageCreate,
    InboxMessageList,
    InboxCount,
    InboxQuery,
    InboxCountQuery,
    OrganizationInboxMessageRef,
} from '../../../types'
import { toInboxQuery, toInboxCountQuery } from '../inbox-query'

/**
 * Resource for managing an organization's inbox messages.
 */
export class OrganizationInboxResource extends BaseResource {
    /**
     * Creates one or more inbox messages for organizations. Processed asynchronously.
     * @param messages - Inbox messages to create (max 100)
     */
    async create(messages: OrganizationInboxMessageCreate[]): Promise<void> {
        await this.call<void>(() =>
            this.client.POST('/api/client/projects/{projectID}/organizations/inbox', {
                params: this.withProject(),
                body: messages as never,
            }),
        )
    }

    /**
     * Returns visible, non-expired inbox messages for an organization.
     * @param query - Filter including source, externalId and channel
     * @returns Promise resolving to a paginated list of inbox messages
     */
    async query(query: InboxQuery): Promise<InboxMessageList> {
        return this.call<InboxMessageList>(() =>
            this.client.GET('/api/client/projects/{projectID}/organizations/inbox', {
                params: { path: { projectID: this.transport.projectId }, query: toInboxQuery(query) },
            }),
        )
    }

    /**
     * Returns unread and total visible inbox message counts for an organization.
     * @param query - Filter including source, externalId and channel
     * @returns Promise resolving to the inbox counts
     */
    async count(query: InboxCountQuery): Promise<InboxCount> {
        return this.call<InboxCount>(() =>
            this.client.GET('/api/client/projects/{projectID}/organizations/inbox/count', {
                params: { path: { projectID: this.transport.projectId }, query: toInboxCountQuery(query) },
            }),
        )
    }

    /**
     * Marks one or more organization inbox messages as read. Processed asynchronously.
     * @param messages - References to the messages to mark read (max 100)
     */
    async markRead(messages: OrganizationInboxMessageRef[]): Promise<void> {
        await this.call<void>(() =>
            this.client.POST('/api/client/projects/{projectID}/organizations/inbox/read', {
                params: this.withProject(),
                body: messages as never,
            }),
        )
    }

    /**
     * Marks one or more organization inbox messages as archived. Processed asynchronously.
     * @param messages - References to the messages to mark archived (max 100)
     */
    async markArchived(messages: OrganizationInboxMessageRef[]): Promise<void> {
        await this.call<void>(() =>
            this.client.POST('/api/client/projects/{projectID}/organizations/inbox/archived', {
                params: this.withProject(),
                body: messages as never,
            }),
        )
    }
}
