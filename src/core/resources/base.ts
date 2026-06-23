import { Transport, TypedFetchClient } from '../transport'
import { LunogramError, NetworkError } from '../errors'

/**
 * Base class for the hand-written resource facades.
 *
 * Resources call the spec-generated typed client ({@link TypedFetchClient})
 * exposed by {@link Transport}. The `{projectID}` path parameter is injected
 * here for every call ({@link withProject}) so individual methods only name
 * their operation and payload — never the project scoping or the path prefix,
 * which come from the generated layer.
 */
export abstract class BaseResource {
    protected readonly transport: Transport

    constructor(transport: Transport) {
        this.transport = transport
    }

    protected get client(): TypedFetchClient {
        return this.transport.client
    }

    /**
     * Build the request `params` object with the `{projectID}` path parameter
     * filled in, merged with any extra path params an operation needs.
     */
    protected withProject<P extends Record<string, unknown> = Record<string, never>>(
        path?: P,
    ): { path: P & { projectID: string } } {
        return { path: { ...(path as P), projectID: this.transport.projectId } }
    }

    /**
     * Run a generated-client call and normalize the outcome: translate raw
     * fetch failures into {@link NetworkError} and HTTP failures into the
     * Lunogram error hierarchy (via {@link Transport.unwrap}).
     *
     * The generated client returns wire (snake_case) response types; the public
     * facade types are camelCase. The SDK has always returned the raw JSON body
     * typed as its camelCase type (responses are not re-mapped at runtime), so
     * the result data is cast to the requested `T` at this single boundary.
     */
    protected async call<T>(
        op: () => Promise<{ data?: unknown; error?: unknown; response: Response }>,
    ): Promise<T> {
        let result
        try {
            result = await op()
        } catch (error) {
            if (error instanceof LunogramError) {
                throw error
            }
            const message = error instanceof Error ? error.message : 'Unknown error'
            throw new NetworkError(
                `Network request failed: ${message}`,
                error instanceof Error ? error : undefined,
            )
        }
        return this.transport.unwrap<T>(result as { data?: T; error?: unknown; response: Response })
    }
}
