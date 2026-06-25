/** Request to mint a session token for an end user. */
export interface CreateSessionRequest {
    /** The end user's external identifier (the session subject). */
    userId: string
}

/** A minted session token (a bearer token for the Client API). */
export interface SessionToken {
    token: string
    expiresAt: string
}
