import { ClientProps } from '../types'
import { mapKeys } from '../utils'
import { DefaultEndpoint } from './constants'
import {
    LunogramError,
    NetworkError,
    RequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ValidationError,
} from './errors'

type HttpMethod = 'GET' | 'POST' | 'DELETE'

const statusErrorFactories: Partial<Record<number, () => LunogramError>> = {
    400: () => new ValidationError('Invalid request'),
    401: () => new UnauthorizedError(),
    403: () => new ForbiddenError(),
    404: () => new NotFoundError(),
}

export class HttpHandler {
    readonly #apiKey: string
    readonly #baseUrl: string

    #emptyResponse<T>(): T {
        return undefined!
    }

    constructor(props: ClientProps) {
        this.#apiKey = props.apiKey
        this.#baseUrl = props.urlEndpoint ?? DefaultEndpoint
    }

    async get<T = unknown>(path: string, data?: unknown): Promise<T> {
        return this.#request<T>('GET', path, data)
    }

    async post<T = unknown>(path: string, data?: unknown): Promise<T> {
        return this.#request<T>('POST', path, data)
    }

    async delete<T = unknown>(path: string, data?: unknown): Promise<T> {
        return this.#request<T>('DELETE', path, data)
    }

    async #request<T>(method: HttpMethod, path: string, data?: unknown): Promise<T> {
        const url = `${this.#baseUrl}/client/${path}`

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.#apiKey}`,
                },
                body: data ? JSON.stringify(mapKeys(data)) : undefined,
            })

            return this.#handleResponse<T>(response)
        } catch (error) {
            if (error instanceof LunogramError) {
                throw error
            }

            const message = error instanceof Error ? error.message : 'Unknown error'
            throw new NetworkError(`Network request failed: ${message}`, error instanceof Error ? error : undefined)
        }
    }

    async #handleResponse<T>(response: Response): Promise<T> {

        if (!response.ok) {
            throw await this.#mapError(response)
        }

        const contentLength = response.headers.get('content-length')
        if (contentLength === '0') {
            return this.#emptyResponse<T>()
        }

        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
            return this.#emptyResponse<T>()
        }

        return response.json()
    }

    async #mapError(response: Response): Promise<LunogramError> {
        const status = response.status

        const createError = statusErrorFactories[status]
        if (createError) {
            return createError()
        }

        let detail = `Request failed with status ${status}`
        try {
            const body = await response.json()
            if (body?.detail) {
                detail = body.detail
            }
        } catch {
            // no parseable body
        }

        return new RequestError(status, detail)
    }
}
