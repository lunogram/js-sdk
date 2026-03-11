import { BrowserClient } from './platform/browser'
import { ClientNamespace } from './core/factory'

export * from './core/client'
export * from './core/http'
export * from './core/errors'
export * from './core/resources'
export * from './types'
export * from './utils'

export class Lunogram {
    private client: BrowserClient

    constructor(apiKey: string, urlEndpoint?: string) {
        this.client = new BrowserClient({ apiKey, urlEndpoint })
    }

    get user(): ClientNamespace['user'] {
        return this.client.user
    }

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
