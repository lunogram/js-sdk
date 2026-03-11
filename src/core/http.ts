import { JSONValue, ClientProps } from '../types'
import { mapKeys } from '../utils'
import { DefaultEndpoint } from './constants'
import {
    LunogramError,
    NetworkError,
    RequestError,
    UnauthorizedError,
    NotFoundError,
    ValidationError,
} from './errors'

type HttpMethod = 'GET' | 'POST' | 'DELETE'

const statusErrorFactories: Partial<Record<number, () => LunogramError>> = {
    400: () => new ValidationError('Invalid request'),
    401: () => new UnauthorizedError(),
    404: () => new NotFoundError(),
}

export class HttpHandler {
    readonly #apiKey: string
    readonly #baseUrl: string

    constructor(props: ClientProps) {
        this.#apiKey = props.apiKey
        this.#baseUrl = props.urlEndpoint ?? DefaultEndpoint
    }

    async get<T = unknown>(path: string, data?: Record<string, JSONValue>): Promise<T> {
        return this.#request<T>('GET', path, data)
    }

    async post<T = unknown>(path: string, data?: JSONValue): Promise<T> {
        return this.#request<T>('POST', path, data)
    }

    async delete<T = unknown>(path: string, data?: Record<string, JSONValue>): Promise<T> {
        return this.#request<T>('DELETE', path, data)
    }

    async #request<T>(method: HttpMethod, path: string, data?: JSONValue): Promise<T> {
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
            throw this.#mapError(response)
        }

        if (response.status === 204) {
            return undefined as T
        }

        return response.json() as Promise<T>
    }

    #mapError(response: Response): LunogramError {
        const status = response.status

        const createError = statusErrorFactories[status]
        if (createError) {
            return createError()
        }

        return new RequestError(status, `Request failed with status ${status}`)
    }
}
