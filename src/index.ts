import { BrowserClient } from './platform/browser'
import { ClientNamespace } from './core/factory'

export * from './core/client'
export * from './core/http'
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
     * @param urlEndpoint - Optional custom API endpoint URL
     */
    constructor(apiKey: string, urlEndpoint?: string) {
        this.client = new BrowserClient({ apiKey, urlEndpoint })
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
}

declare global {
    interface Window { Lunogram: typeof Lunogram; }
}

if (typeof window !== 'undefined') {
    window.Lunogram = Lunogram
}
