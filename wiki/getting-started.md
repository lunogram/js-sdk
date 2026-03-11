# Getting Started

## Installation

```bash
npm install @lunogram/js-sdk
```

## Initialization

### Browser Usage

The SDK automatically generates and persists an `anonymousId` for each user.

```typescript
import { Lunogram } from '@lunogram/js-sdk'

const lunogram = new Lunogram('your-api-key')

await lunogram.user.upsert({ email: 'user@example.com' })
await lunogram.user.events([{ name: 'user.signed_up', data: {} }])
```

The SDK is exposed on `window.Lunogram` in browsers:

```html
<script>
    const lunogram = new Lunogram('your-api-key')
    lunogram.user.events([{ name: 'user.signed_up', data: {} }])
</script>
```

### Server Usage

```typescript
import { Client } from '@lunogram/js-sdk'

const client = new Client({ 
    apiKey: 'your-api-key',
    urlEndpoint: 'https://your-api.com/api'  // optional
})

await client.user.upsert({ externalId: 'user-123', email: 'user@example.com' })
await client.organization.upsert({ externalId: 'org-456', name: 'Acme Corp' })
```

## API

| SDK Method | HTTP |
|------------|------|
| `client.user.upsert(data)` | POST /client/users |
| `client.user.delete(data)` | DELETE /client/users |
| `client.user.events(data)` | POST /client/users/events |
| `client.organization.upsert(data)` | POST /client/organizations |
| `client.organization.delete(data)` | DELETE /client/organizations |
| `client.organization.addUser(data)` | POST /client/organizations/users |
| `client.organization.removeUser(data)` | DELETE /client/organizations/users |
| `client.organization.events(data)` | POST /client/organizations/events |

For detailed parameter definitions, see the [Live API Documentation](https://console.lab.lunogram.io/api#client).

## BrowserClient

For browser environments, use `BrowserClient` to auto-inject anonymousId/externalId:

```typescript
import { BrowserClient } from '@lunogram/js-sdk'

const client = new BrowserClient({ apiKey: 'your-api-key' })

// anonymousId is auto-generated
client.user.anonymousId

// externalId is set after upsert
await client.user.upsert({ externalId: 'user-123', email: 'a@b.com' })
client.user.externalId  // 'user-123'
```

## Error Handling

```typescript
import { LunogramError, UnauthorizedError, NotFoundError } from '@lunogram/js-sdk'

try {
    await client.user.upsert({})
} catch (error) {
    if (error instanceof UnauthorizedError) {
        console.log('Invalid API key')
    }
}
```

See [Architecture](./architecture.md) for design details.
