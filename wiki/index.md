# Lunogram JS SDK

A type-safe JavaScript SDK for collecting events and managing users/organizations.

## Features

- **TypeScript First** - Full type safety with exported types
- **Namespaced API** - Organized `client.user.*` and `client.organization.*` methods
- **Extensible** - Factory pattern makes adding new API resources trivial
- **Error Handling** - Hierarchical error classes for granular error handling
- **Browser Ready** - Auto-injects anonymousId/externalId in browser environments

## Quick Links

- [Getting Started](./getting-started.md)
- [Architecture](./architecture.md)
- [Extending the SDK](./extending.md)

## Basic Usage

```typescript
import { Lunogram } from '@lunogram/js-sdk'

Lunogram.initialize({ apiKey: 'your-api-key' })

// User operations
await Lunogram.user.upsert({ email: 'user@example.com' })
await Lunogram.user.events([{ name: 'user.signed_up', data: { plan: 'free' } }])

// Organization operations  
await Lunogram.organization.upsert({ externalId: 'org-123', name: 'Acme' })
```

For detailed parameter definitions, see the [Live API Documentation](https://console.lab.lunogram.io/api#client).
