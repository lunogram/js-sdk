import { InboxQuery, InboxCountQuery } from '../../types'

/**
 * Translate the camelCase {@link InboxQuery} facade into the snake_case query
 * object the generated client expects. Query parameters (unlike JSON bodies)
 * are not re-mapped by the transport middleware, so the wire keys are produced
 * here. Undefined optionals are dropped so they never reach the query string.
 */
export function toInboxQuery(q: InboxQuery) {
    return prune({
        source: q.source,
        external_id: q.externalId,
        channel: q.channel,
        status: q.status,
        tags: q.tags,
        message_source: q.messageSource,
        priority: q.priority,
        limit: q.limit,
        offset: q.offset,
    })
}

/** Translate the camelCase {@link InboxCountQuery} facade into the wire query. */
export function toInboxCountQuery(q: InboxCountQuery) {
    return {
        source: q.source,
        external_id: q.externalId,
        channel: q.channel,
    }
}

function prune<T extends Record<string, unknown>>(obj: T): T {
    return Object.fromEntries(
        Object.entries(obj).filter(([, value]) => value !== undefined),
    ) as T
}
