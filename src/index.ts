import { BrowserClient } from './platform/browser'
import { ClientNamespace } from './core/factory'

export * from './core/client'
export * from './core/transport'
export * from './core/errors'
export * from './core/resources'
export * from './types'
export * from './utils'

/**
 * Main Lunogram SDK client for tracking events and managing users/organizations.
 */
export class Lunogram {
    private client: BrowserClient

    /**
     * Creates a new Lunogram instance.
     * @param apiKey - Your Lunogram API key
     * @param projectId - The UUID of your Lunogram project (required). All
     *                    Client API requests are scoped to this project.
     * @param urlEndpoint - Optional custom API endpoint URL
     */
    constructor(apiKey: string, projectId: string, urlEndpoint?: string) {
        this.client = new BrowserClient({ apiKey, projectId, urlEndpoint })
    }

    /**
     * Access user-related methods.
     */
    get user(): ClientNamespace['user'] {
        return this.client.user
    }

    /**
     * Access organization-related methods.
     */
    get organization(): ClientNamespace['organization'] {
        return this.client.organization
    }

    /**
     * Access push notification configuration (e.g. the VAPID public key).
     */
    get push(): ClientNamespace['push'] {
        return this.client.push
    }

    /**
     * Access session token minting for end users.
     */
    get sessions(): ClientNamespace['sessions'] {
        return this.client.sessions
    }
}

declare global {
    interface Window { Lunogram: typeof Lunogram; }
}

if (typeof window !== 'undefined') {
    window.Lunogram = Lunogram
}
