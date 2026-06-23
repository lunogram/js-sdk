import createClient, { type Client as FetchClient, type Middleware } from 'openapi-fetch'
import type { paths } from '../gen/schema'
import { ClientProps } from '../types'
import { mapKeys, isUuid } from '../utils'
import { DefaultEndpoint } from './constants'
import {
    LunogramError,
    RequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ValidationError,
} from './errors'

/**
 * Typed openapi-fetch client generated against the vendored OpenAPI spec
 * (`src/gen/schema.ts`). Every operation, path and payload shape is derived
 * from the spec; this module only adds the cross-cutting concerns the spec
 * cannot express: auth, the project scoping, snake_case mapping and the
 * Lunogram error hierarchy.
 */
export type TypedFetchClient = FetchClient<paths>

const statusErrorFactories: Partial<Record<number, () => LunogramError>> = {
    400: () => new ValidationError('Invalid request'),
    401: () => new UnauthorizedError(),
    403: () => new ForbiddenError(),
    404: () => new NotFoundError(),
}

/**
 * Derive the openapi-fetch base URL from the configured endpoint.
 *
 * The spec carries the `/api` prefix on every path
 * (`/api/client/projects/{projectID}/...`), so the base URL must be the bare
 * origin. The public `urlEndpoint` has historically included a trailing
 * `/api`; we strip exactly one so both `https://host` and `https://host/api`
 * resolve to the same, correct URL.
 */
function toBaseUrl(endpoint: string): string {
    const trimmed = endpoint.replace(/\/+$/, '')
    return trimmed.replace(/\/api$/, '')
}

/**
 * Thin transport over openapi-fetch. The `projectID` path parameter is bound
 * once here (via the public {@link Transport.projectId} getter that resources
 * read) and the auth header + snake_case body mapping are applied centrally in
 * middleware, so resource modules never repeat any of it.
 */
export class Transport {
    readonly #client: TypedFetchClient
    readonly #projectId: string

    constructor(props: ClientProps) {
        const projectId = props.projectId?.trim()
        if (!projectId) {
            throw new ValidationError('A non-empty `projectId` is required to create a Lunogram client')
        }
        if (!isUuid(projectId)) {
            throw new ValidationError('`projectId` must be a valid UUID')
        }

        this.#projectId = projectId

        const baseUrl = toBaseUrl(props.urlEndpoint ?? DefaultEndpoint)
        this.#client = createClient<paths>({ baseUrl })

        const apiKey = props.apiKey

        // Auth + body mapping: applied to every request, once.
        const middleware: Middleware = {
            async onRequest({ request }) {
                request.headers.set('Authorization', `Bearer ${apiKey}`)

                // The public API speaks camelCase; the wire format is
                // snake_case. Re-encode the JSON body centrally so resource
                // modules can pass through their typed payloads untouched.
                const contentType = request.headers.get('content-type')
                if (contentType?.includes('application/json')) {
                    const raw = await request.clone().text()
                    if (raw) {
                        const mapped = mapKeys(JSON.parse(raw))
                        return new Request(request, { body: JSON.stringify(mapped) })
                    }
                }

                return request
            },
        }
        this.#client.use(middleware)
    }

    /**
     * The validated project UUID. Resource modules pass this as the
     * `{projectID}` path parameter so the spec-generated paths resolve under
     * `/api/client/projects/{projectId}/...`.
     */
    get projectId(): string {
        return this.#projectId
    }

    get client(): TypedFetchClient {
        return this.#client
    }

    /**
     * Map an openapi-fetch result onto the Lunogram return contract: throw the
     * appropriate {@link LunogramError} on failure, otherwise return the parsed
     * body (or `undefined` for empty/no-content responses).
     */
    unwrap<T>(result: { data?: T; error?: unknown; response: Response }): T {
        const { data, error, response } = result
        if (response.ok) {
            return data as T
        }
        throw this.mapError(response, error)
    }

    private mapError(response: Response, body: unknown): LunogramError {
        const status = response.status

        const createError = statusErrorFactories[status]
        if (createError) {
            return createError()
        }

        let detail = `Request failed with status ${status}`
        const problem = body as { detail?: string } | undefined
        if (problem?.detail) {
            detail = problem.detail
        }

        return new RequestError(status, detail)
    }
}
