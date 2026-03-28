import { LunogramError } from './base'

export class NetworkError extends LunogramError {
    readonly statusCode = 0
    readonly code = 'NETWORK_ERROR'

    constructor(message: string, public readonly cause?: Error) {
        super(message)
    }
}

export class RequestError extends LunogramError {
    readonly code: string

    constructor(
        public readonly statusCode: number,
        message: string,
        public readonly details?: Record<string, unknown>,
        code = 'REQUEST_ERROR'
    ) {
        super(message)
        this.code = code
    }
}

export class UnauthorizedError extends RequestError {
    constructor(message = 'Invalid or missing API key') {
        super(401, message, undefined, 'UNAUTHORIZED')
    }
}

export class ForbiddenError extends RequestError {
    constructor(message = 'Forbidden') {
        super(403, message, undefined, 'FORBIDDEN')
    }
}

export class NotFoundError extends RequestError {
    constructor(message = 'Resource not found') {
        super(404, message, undefined, 'NOT_FOUND')
    }
}

export class ValidationError extends RequestError {
    constructor(message = 'Invalid request data', details?: Record<string, unknown>) {
        super(400, message, details, 'VALIDATION_ERROR')
    }
}
