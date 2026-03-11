# Architecture

The SDK is built using OOP principles with a focus on extensibility and type safety.

## Design Patterns

### 1. Factory Pattern

The `createClientNamespace()` function in `src/core/factory.ts` creates namespaced API resources:

```typescript
// factory.ts
export function createClientNamespace(http: HttpHandler): ClientNamespace {
    return {
        user: new UserResource(http),
        organization: new OrganizationResource(http),
    }
}
```

This makes it trivial to add new API namespaces - just add a new resource to the factory.

### 2. Resource Pattern (Inheritance)

All API namespaces extend `BaseResource`:

```
BaseResource (abstract)
├── endpoint: string      # API path (e.g., 'users', 'organizations')
├── get()                 # HTTP GET
├── post()                # HTTP POST
└── remove()              # HTTP DELETE

UserResource extends BaseResource
├── endpoint = 'users'
├── upsert()
├── delete()
├── events()
└── track()

OrganizationResource extends BaseResource
├── endpoint = 'organizations'
├── upsert()
├── delete()
├── addUser()
├── removeUser()
└── events()
```

### 3. Inheritance for BrowserClient

`BrowserClient` extends `Client` to provide browser-specific features:

```typescript
class BrowserClient extends Client {
    // Auto-injects anonymousId/externalId on all user methods
}
```

## File Structure

```
src/
├── core/
│   ├── client.ts           # Main Client class
│   ├── http.ts             # HTTP handler (GET/POST/DELETE)
│   ├── factory.ts          # Creates namespace resources
│   ├── errors/             # Hierarchical error classes
│   │   ├── base.ts         # LunogramError base
│   │   ├── request.ts      # Request-specific errors
│   │   └── index.ts
│   └── resources/
│       ├── base.ts         # Abstract BaseResource
│       ├── user.ts         # User namespace
│       └── organization.ts # Organization namespace
├── platform/
│   └── browser.ts          # BrowserClient (auto-ID injection)
├── types/                  # Exported TypeScript types
└── index.ts               # Lunogram facade
```

## HTTP Handler

The `HttpHandler` class (`src/core/http.ts`) handles all HTTP communication:

- **GET** - Fetch data
- **POST** - Create/update data
- **DELETE** - Remove data

It automatically:
- Adds `Authorization: Bearer <apiKey>` header
- Serializes body to JSON
- Maps camelCase to snake_case via `mapKeys()` utility
- Maps HTTP status codes to error types

## Error Handling

Errors form a hierarchy:

```
LunogramError (abstract)
├── NetworkError      # Network failures
└── RequestError      # HTTP errors
    ├── ValidationError   # 400
    ├── UnauthorizedError # 401
    └── NotFoundError     # 404
```

See [Error Handling Guide](./api-reference/errors.md) for details.

## Extending the SDK

Adding a new API namespace (e.g., `projects`) requires:

1. Create `src/core/resources/project.ts` extending `BaseResource`
2. Add to `ClientNamespace` interface in `factory.ts`
3. Add to `createClientNamespace()` in `factory.ts`

See [Extending Guide](./extending.md) for step-by-step instructions.
