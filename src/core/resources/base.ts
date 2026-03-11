import { HttpHandler } from '../http'
import { JSONValue } from '../../types'

export abstract class BaseResource {
    readonly #http: HttpHandler

    constructor(http: HttpHandler) {
        this.#http = http
    }

    protected abstract readonly endpoint: string

    protected async get<T = unknown>(data?: Record<string, JSONValue>): Promise<T> {
        return this.#http.get<T>(this.endpoint, data)
    }

    protected async post<T = unknown>(data?: Record<string, JSONValue>): Promise<T> {
        return this.#http.post<T>(this.endpoint, data)
    }

    protected async remove<T = unknown>(data?: Record<string, JSONValue>): Promise<T> {
        return this.#http.delete<T>(this.endpoint, data)
    }
}
