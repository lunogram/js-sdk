import { HttpHandler } from '../http'

export abstract class BaseResource {
    readonly #http: HttpHandler

    constructor(http: HttpHandler) {
        this.#http = http
    }

    protected abstract readonly endpoint: string

    protected async get<T = unknown>(data?: unknown): Promise<T | undefined> {
        return this.#http.get<T>(this.endpoint, data)
    }

    protected async post<T = unknown>(data?: unknown, pathOverride?: string): Promise<T | undefined> {
        return this.#http.post<T>(pathOverride ?? this.endpoint, data)
    }

    protected async remove<T = unknown>(data?: unknown, pathOverride?: string): Promise<T | undefined> {
        return this.#http.delete<T>(pathOverride ?? this.endpoint, data)
    }
}
