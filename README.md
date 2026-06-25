# Lunogram JS SDK

A type-safe JavaScript SDK for collecting events and managing users/organizations.

## Features

- **TypeScript First** — Full type safety with exported types
- **Namespaced API** — Organized `client.user.*` and `client.organization.*` methods
- **Flexible Identity** — Identify users and organizations with multiple external identifiers
- **Extensible** — Factory pattern makes adding new API resources trivial
- **Error Handling** — Hierarchical error classes for granular error handling
- **Browser Ready** — Auto-injects anonymous and sticky identifiers in browser environments

## Installation

```
npm install @lunogram/js-sdk
```

## Quick Start

```typescript
import { Lunogram } from '@lunogram/js-sdk'

// The project UUID is required and scopes every request to that project.
const lunogram = new Lunogram('your-api-key', 'your-project-uuid')

// Identify a user
await lunogram.user.upsert({
    identifier: [{ externalId: 'user-123' }],
    email: 'user@example.com',
})

// Track events
await lunogram.user.events.post([
    {
        name: 'purchase_completed',
        identifier: [{ externalId: 'user-123' }],
        data: { product_id: 'prod_789', amount: 99.99 },
    },
])

// Organization operations
await lunogram.organization.upsert({
    identifier: [{ externalId: 'org-456' }],
    name: 'Acme Corp',
})
```

## Project Scoping

Every Lunogram Client API request is scoped to a single **project**. You supply
the project UUID once, when constructing the client, and the SDK injects it into
every request path automatically — you never pass it per call.

All Client API endpoints live under `/api/client/projects/{projectId}/...`:

| Operation                | Path                                                              |
| ------------------------ | ----------------------------------------------------------------- |
| Users                    | `/api/client/projects/{projectId}/users`                          |
| User events              | `/api/client/projects/{projectId}/users/events`                   |
| User scheduled           | `/api/client/projects/{projectId}/users/scheduled`                |
| User inbox               | `/api/client/projects/{projectId}/users/inbox`                    |
| User devices             | `/api/client/projects/{projectId}/users/devices`                  |
| Organizations            | `/api/client/projects/{projectId}/organizations`                  |
| Organization members     | `/api/client/projects/{projectId}/organizations/users`            |
| Organization events      | `/api/client/projects/{projectId}/organizations/events`           |
| Organization scheduled   | `/api/client/projects/{projectId}/organizations/scheduled`        |
| Organization inbox       | `/api/client/projects/{projectId}/organizations/inbox`            |
| Push (VAPID key)         | `/api/client/projects/{projectId}/push/vapid`                     |
| Sessions                 | `/api/client/projects/{projectId}/auth-methods/{authMethodId}/sessions` |

The `projectId` must be a valid UUID; the client throws a `ValidationError` at
construction time if it is missing, empty, or malformed.

## Identity Model

Users and organizations are identified by an array of `ExternalID` objects:

```typescript
interface ExternalID {
    source?: string    // e.g. "default", "anonymous", or a custom source
    externalId: string // the identifier value
    metadata?: Record<string, any> | null
}
```

This allows associating multiple identifiers with a single user or organization, each from a different source system.

## Usage

### Browser

The SDK automatically generates an anonymous identifier for each session. When you identify a user with a `"default"` source, that ID becomes sticky for all subsequent calls.

```typescript
import { BrowserClient } from '@lunogram/js-sdk'

const client = new BrowserClient({
    apiKey: 'your-api-key',
    projectId: 'your-project-uuid',
})

// anonymousId is auto-generated
client.user.anonymousId

// Identify the user — both anonymous and default identifiers are sent
await client.user.upsert({
    identifier: [{ externalId: 'user-123' }],
    email: 'user@example.com',
})

// externalId is now sticky for future calls
client.user.externalId // 'user-123'

// Events automatically include the identifier
await client.user.events.post([
    { name: 'page_viewed', data: { page: '/dashboard' } },
])

// Scheduled resources also inherit the identifier
await client.user.schedule.upsert({
    name: 'trial_end',
    scheduledAt: '2025-12-25T10:00:00Z',
    data: { plan: 'pro' },
})
```

The SDK is also exposed on `window.Lunogram`:

```html
<script>
    const lunogram = new Lunogram('your-api-key', 'your-project-uuid')
    lunogram.user.upsert({
        identifier: [{ externalId: 'user-123' }],
        email: 'user@example.com',
    })
</script>
```

### Server

```typescript
import { Client } from '@lunogram/js-sdk'

const client = new Client({
    apiKey: 'your-api-key',
    projectId: 'your-project-uuid', // required — scopes all requests to this project
    urlEndpoint: 'https://your-api.com/api', // optional
})

// Users
await client.user.upsert({
    identifier: [{ externalId: 'user-123' }],
    email: 'user@example.com',
    data: { first_name: 'John' },
})

await client.user.events.post([
    {
        name: 'purchase_completed',
        identifier: [{ externalId: 'user-123' }],
        data: { amount: 99.99 },
    },
])

await client.user.delete({
    identifier: [{ externalId: 'user-123' }],
})

// Organizations
await client.organization.upsert({
    identifier: [{ externalId: 'org-456' }],
    name: 'Acme Corp',
    data: { industry: 'technology' },
})

await client.organization.addUser({
    organization: { identifier: [{ externalId: 'org-456' }] },
    user: { identifier: [{ externalId: 'user-123' }] },
    data: { role: 'admin' },
})

await client.organization.removeUser({
    organization: { identifier: [{ externalId: 'org-456' }] },
    user: { identifier: [{ externalId: 'user-123' }] },
})

// Organization events
await client.organization.events.post([
    {
        identifier: [{ externalId: 'org-456' }],
        name: 'subscription_upgraded',
        data: { plan: 'enterprise' },
    },
])

// Scheduled resources
await client.user.schedule.upsert({
    name: 'renewal_date',
    identifier: [{ externalId: 'user-123' }],
    scheduledAt: '2025-12-25T10:00:00Z',
    data: { plan: 'pro', amount: 29.99 },
})

await client.organization.schedule.upsert({
    name: 'contract_renewal',
    identifier: [{ externalId: 'org-456' }],
    scheduledAt: '2025-12-25T10:00:00Z',
})
```

### Inbox

Create, query, count and update inbox messages for users and organizations. The
same surface is available under `client.organization.inbox.*`.

```typescript
// Create inbox messages (max 100 per call)
await client.user.inbox.create([
    {
        target: [{ externalId: 'user-123' }],
        identifier: { externalId: 'msg-1' },
        channel: 'inbox',
        content: { title: 'Welcome', body: 'Thanks for joining!' },
    },
])

// Query a user's visible messages
const { results, total } = await client.user.inbox.query({
    source: 'default',
    externalId: 'user-123',
    channel: 'inbox',
    status: 'unread',
})

// Unread / total counts
const counts = await client.user.inbox.count({
    source: 'default',
    externalId: 'user-123',
    channel: 'inbox',
})

// Mark messages read / archived
await client.user.inbox.markRead([{ target: [{ externalId: 'user-123' }], messageId: 'msg-1' }])
await client.user.inbox.markArchived([{ target: [{ externalId: 'user-123' }], messageId: 'msg-1' }])
```

### Devices & Push

Register a device's push subscription and fetch the project's VAPID public key
for Web Push. In the browser, the current session identifier is injected
automatically.

```typescript
const { publicKey } = await client.push.getVapidPublicKey()

await client.user.devices.register({
    identifier: [{ externalId: 'user-123' }],
    deviceId: 'device-1',
    os: 'web',
    config: {
        endpoint: 'https://push.example.com/...',
        keys: { p256dh: '...', auth: '...' },
    },
})
```

### Sessions

Mint a short-lived session token for an end user, server-side, so the client can
call the Client API directly. The permissions are defined by the session auth
method (policy) named in the call.

```typescript
const session = await client.sessions.create('auth-method-uuid', {
    userId: 'user-123',
})

// session.token is a bearer token for the Client API; session.expiresAt is its expiry
```

### Multiple Identifiers

You can pass multiple identifiers from different sources:

```typescript
await client.user.upsert({
    identifier: [
        { source: 'default', externalId: 'user-123' },
        { source: 'stripe', externalId: 'cus_abc123', metadata: { plan: 'pro' } },
        { source: 'hubspot', externalId: 'hs-contact-456' },
    ],
    email: 'user@example.com',
})
```
