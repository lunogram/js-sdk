# Extending the SDK

The SDK is designed to be easily extensible. Adding a new API namespace (e.g., `projects`) requires just a few steps.

## Example: Adding a Projects Resource

### Step 1: Create the Resource Class

Create `src/core/resources/project.ts`:

```typescript
import { BaseResource } from './base'
import { JSONValue } from '../../types'

export class ProjectResource extends BaseResource {
    readonly endpoint = 'projects'

    async create(data: ProjectCreateRequest) {
        return this.post(data as unknown as Record<string, JSONValue>)
    }

    async delete(data: ProjectDeleteRequest) {
        return this.remove(data as unknown as Record<string, JSONValue>)
    }

    async list() {
        return this.get()
    }

    async get(data: ProjectGetRequest) {
        return this.post(data as unknown as Record<string, JSONValue>)
    }
}
```

### Step 2: Define Types

Add types to `src/types/request.ts`:

```typescript
export interface ProjectCreateRequest {
    externalId: string
    name?: string
    data?: Record<string, JSONValue>
}

export interface ProjectDeleteRequest {
    externalId: string
}

export interface ProjectGetRequest {
    externalId: string
}
```

### Step 3: Update the Factory

Edit `src/core/factory.ts`:

```typescript
import { ProjectResource } from './resources/project'

export interface ClientNamespace {
    user: UserResource
    organization: OrganizationResource
    project: ProjectResource  // Add this
}

export function createClientNamespace(http: HttpHandler): ClientNamespace {
    return {
        user: new UserResource(http),
        organization: new OrganizationResource(http),
        project: new ProjectResource(http),  // Add this
    }
}
```

### Step 4: Use the New Resource

```typescript
import { Client } from '@lunogram/js-sdk'

const client = new Client({ apiKey: 'key' })

// Now available!
await client.project.list()
await client.project.create({ 
    externalId: 'proj-1', 
    name: 'My Project' 
})
```

---

## Adding to BrowserClient

If you need browser-specific behavior (like auto-injecting IDs), create a wrapper:

```typescript
// src/platform/browser.ts
import { ProjectResource } from '../core/resources/project'

class BrowserProjectResource extends ProjectResource {
    // Add browser-specific logic here
}

export class BrowserClient extends Client {
    readonly project: BrowserProjectResource

    constructor(props: ClientProps) {
        super(props)
        this.project = new BrowserProjectResource(super.httpHandler)
    }
}
```

---

## Guidelines

1. **Extend BaseResource** - Always inherit from `BaseResource` for consistent HTTP handling
2. **Define the endpoint** - Set `readonly endpoint = 'path'` for the API route
3. **Use protected methods** - Use `get()`, `post()`, `remove()` for HTTP operations
4. **Type your methods** - Define TypeScript interfaces for request/response types
5. **Update the factory** - Always register new resources in `ClientNamespace` and `createClientNamespace()`

---

## Testing Your Extension

```typescript
// Test the new resource
const client = new Client({ apiKey: 'test-key' })

const projects = await client.project.list()
console.log(projects)
```
