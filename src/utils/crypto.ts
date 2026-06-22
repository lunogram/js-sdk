import { v4 as uuidv4, validate as uuidValidate } from 'uuid'

export function generateUuid(): string {
    return uuidv4()
}

export function isUuid(value: string): boolean {
    return uuidValidate(value)
}
