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

const lunogram = new Lunogram('your-api-key')

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

const client = new BrowserClient({ apiKey: 'your-api-key' })

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
    const lunogram = new Lunogram('your-api-key')
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
