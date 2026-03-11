import { BrowserClient } from './platform/browser'
import { ClientProps } from './types'
import { ClientNamespace } from './core/factory'

export * from './core/client'
export * from './core/http'
export * from './core/errors'
export * from './core/resources'
export * from './types'
export * from './utils'

export class Lunogram {
    private static client?: BrowserClient

    static initialize(props: ClientProps) {
        Lunogram.client = new BrowserClient(props)
    }

    static get user(): ClientNamespace['user'] {
        if (!Lunogram.client) {
            throw new Error('Lunogram: SDK must be initialized with .initialize(props) before use.')
        }
        return Lunogram.client.user
    }

    static get organization(): ClientNamespace['organization'] {
        if (!Lunogram.client) {
            throw new Error('Lunogram: SDK must be initialized with .initialize(props) before use.')
        }
        return Lunogram.client.organization
    }
}

declare global {
    interface Window { Lunogram: typeof Lunogram; }
}

if (typeof window !== 'undefined') {
    window.Lunogram = Lunogram
}
