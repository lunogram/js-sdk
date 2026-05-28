import { BaseResource } from '../base'
import {
    PostInboxMessagesRequest,
    InboxMessageEvents,
    GetInboxParams,
    GetInboxCountParams,
    InboxMessageList,
    InboxCount,
} from '../../../types'

export class OrganizationInboxResource extends BaseResource {
    readonly endpoint = 'organizations/inbox'

    /**
     * Creates one or more inbox messages for organizations. Processed asynchronously.
     */
    async create(data: PostInboxMessagesRequest): Promise<void> {
        return super.post<void>(data)
    }

    /**
     * Returns visible, non-expired inbox messages for an organization.
     */
    async list(params: GetInboxParams): Promise<InboxMessageList | undefined> {
        return super.get<InboxMessageList>(params)
    }

    /**
     * Returns unread and total inbox message counts for an organization.
     */
    async count(params: GetInboxCountParams): Promise<InboxCount | undefined> {
        return super.get<InboxCount>(params, 'organizations/inbox/count')
    }

    /**
     * Marks one or more inbox messages as opened. Processed asynchronously.
     */
    async opened(data: InboxMessageEvents): Promise<void> {
        return super.post<void>(data, 'organizations/inbox/opened')
    }

    /**
     * Marks one or more inbox messages as archived. Processed asynchronously.
     */
    async archived(data: InboxMessageEvents): Promise<void> {
        return super.post<void>(data, 'organizations/inbox/archived')
    }
}
