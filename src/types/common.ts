export type JSONValue = string | number | boolean | null | { [key: string]: JSONValue } | JSONValue[]

export interface ClientProps {
    apiKey: string
    urlEndpoint?: string
}
