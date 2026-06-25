import { BaseResource } from '../base'
import {
    InboxMessageCreate,
    InboxMessageList,
    InboxCount,
    InboxQuery,
    InboxCountQuery,
    UserInboxMessageRef,
} from '../../../types'
import { toInboxQuery, toInboxCountQuery } from '../inbox-query'

/**
 * Resource for managing a user's inbox messages.
 */
export class UserInboxResource extends BaseResource {
    /**
     * Creates one or more inbox messages for users. Processed asynchronously.
     * @param messages - Inbox messages to create (max 100)
     */
    async create(messages: InboxMessageCreate[]): Promise<void> {
        await this.call<void>(() =>
            this.client.POST('/api/client/projects/{projectID}/users/inbox', {
                params: this.withProject(),
                body: messages as never,
            }),
        )
    }

    /**
     * Returns visible, non-expired inbox messages for a user.
     * @param query - Filter including source, externalId and channel
     * @returns Promise resolving to a paginated list of inbox messages
     */
    async query(query: InboxQuery): Promise<InboxMessageList> {
        return this.call<InboxMessageList>(() =>
            this.client.GET('/api/client/projects/{projectID}/users/inbox', {
                params: { path: { projectID: this.transport.projectId }, query: toInboxQuery(query) },
            }),
        )
    }

    /**
     * Returns unread and total visible inbox message counts for a user.
     * @param query - Filter including source, externalId and channel
     * @returns Promise resolving to the inbox counts
     */
    async count(query: InboxCountQuery): Promise<InboxCount> {
        return this.call<InboxCount>(() =>
            this.client.GET('/api/client/projects/{projectID}/users/inbox/count', {
                params: { path: { projectID: this.transport.projectId }, query: toInboxCountQuery(query) },
            }),
        )
    }

    /**
     * Marks one or more user inbox messages as read. Processed asynchronously.
     * @param messages - References to the messages to mark read (max 100)
     */
    async markRead(messages: UserInboxMessageRef[]): Promise<void> {
        await this.call<void>(() =>
            this.client.POST('/api/client/projects/{projectID}/users/inbox/read', {
                params: this.withProject(),
                body: messages as never,
            }),
        )
    }

    /**
     * Marks one or more user inbox messages as archived. Processed asynchronously.
     * @param messages - References to the messages to mark archived (max 100)
     */
    async markArchived(messages: UserInboxMessageRef[]): Promise<void> {
        await this.call<void>(() =>
            this.client.POST('/api/client/projects/{projectID}/users/inbox/archived', {
                params: this.withProject(),
                body: messages as never,
            }),
        )
    }
}
