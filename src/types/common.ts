export type JSONValue = string | number | boolean | null | { [key: string]: JSONValue } | JSONValue[]

export interface ClientProps {
    apiKey: string
    /**
     * The UUID of the Lunogram project. Required. Every Client API request is
     * scoped to this project and issued under `/client/projects/{projectId}/...`.
     */
    projectId: string
    urlEndpoint?: string
}
