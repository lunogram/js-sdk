import { JSONValue } from './common'

export type TrackProps = {
    event: string
    anonymousId?: string
    externalId?: string
    properties: Record<string, JSONValue>
}

export type EventProps = {
    name: string
    anonymousId?: string
    externalId?: string
    properties?: Record<string, JSONValue>
}

export type IdentifyProps = {
    anonymousId?: string
    externalId: string
    phone?: string
    email?: string
    timezone?: string
    locale?: string
    traits: Record<string, JSONValue>
}

export type AliasProps = {
    anonymousId: string
    externalId: string
}
