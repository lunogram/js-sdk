import { BaseResource } from './base'
import { CreateSessionRequest, SessionToken } from '../../types'

/**
 * Project-level resource for minting end-user session tokens.
 *
 * Called server-side with an API key; the returned token is a short-lived
 * bearer token for the Client API whose permissions are defined by the session
 * auth method (policy) named by `authMethodId`.
 */
export class SessionResource extends BaseResource {
    /**
     * Mints a session token for an end user.
     * @param authMethodId - The session auth method (policy) the session uses
     * @param data - Request identifying the session subject (the end user)
     * @returns Promise resolving to the minted session token
     */
    async create(authMethodId: string, data: CreateSessionRequest): Promise<SessionToken> {
        return this.call<SessionToken>(() =>
            this.client.POST('/api/client/projects/{projectID}/auth-methods/{authMethodID}/sessions', {
                params: this.withProject({ authMethodID: authMethodId }),
                body: data as never,
            }),
        )
    }
}
