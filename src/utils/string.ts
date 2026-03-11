import { JSONValue } from '../types'

export const camelToUnderscore = (key: string) => key.replace(/([A-Z])/g, "_$1").toLowerCase()

export function mapKeys(value: JSONValue): JSONValue {
    if (value === null || typeof value !== 'object') {
        return value
    }

    if (Array.isArray(value)) {
        return value.map((item) => mapKeys(item))
    }

    const newObj: Record<string, JSONValue> = {}
    for (const key in value) {
        const transformedKey = camelToUnderscore(key)
        const val = value[key]

        if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
            newObj[transformedKey] = mapKeys(val as Record<string, JSONValue>)
        } else if (Array.isArray(val)) {
            newObj[transformedKey] = val.map((item) => {
                if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
                    return mapKeys(item as Record<string, JSONValue>)
                }
                return item
            })
        } else {
            newObj[transformedKey] = val
        }
    }

    return newObj
}
