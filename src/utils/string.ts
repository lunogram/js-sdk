import { JSONValue } from '../types'

export const camelToUnderscore = (key: string) => key.replace(/([A-Z])/g, "_$1").toLowerCase()

export function mapKeys(value: Record<string, JSONValue> | Record<string, JSONValue>[]): Record<string, JSONValue> | Record<string, JSONValue>[] {
    if (Array.isArray(value)) {
        return value.map((item) => mapKeys(item)) as Record<string, JSONValue>[]
    }

    const newObj: Record<string, JSONValue> = {}
    for (const key in value) {
        newObj[camelToUnderscore(key)] = value[key]
    }

    return newObj
}
