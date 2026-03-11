export abstract class LunogramError extends Error {
    abstract readonly statusCode: number
    abstract readonly code: string

    constructor(message: string) {
        super(message)
        this.name = this.constructor.name
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            statusCode: this.statusCode,
        }
    }
}
