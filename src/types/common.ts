export type JSONValue = string | number | boolean | null | { [key: string]: JSONValue } | JSONValue[]

export type ClientProps = {
    apiKey: string
    urlEndpoint: string
}
