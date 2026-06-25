import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Client, ValidationError } from '../src'

const apiKey = 'test-api-key'
const projectId = '11111111-1111-4111-8111-111111111111'
const urlEndpoint = 'https://api.example.com/api'

function mockFetch() {
    return vi.fn(async () =>
        new Response(JSON.stringify({}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }),
    )
}

describe('Client API URL construction', () => {
    let fetchMock: ReturnType<typeof mockFetch>

    beforeEach(() => {
        fetchMock = mockFetch()
        vi.stubGlobal('fetch', fetchMock)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    // openapi-fetch invokes the global fetch with a `Request` object rather
    // than a URL string, so read the resolved URL off the request's `.url`.
    function urlOf(input: unknown): string {
        if (input instanceof Request) {
            return input.url
        }
        return String(input)
    }

    function lastUrl(): string {
        const call = fetchMock.mock.calls.at(-1)
        return urlOf(call?.[0])
    }

    it('prefixes user requests with /client/projects/{projectId}', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })
        await client.user.upsert({ identifier: [{ externalId: 'user-1' }] })
        expect(lastUrl()).toBe(`${urlEndpoint}/client/projects/${projectId}/users`)
    })

    it('prefixes user events', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })
        await client.user.events.post([{ name: 'evt', identifier: [{ externalId: 'u' }], data: {} }])
        expect(lastUrl()).toBe(`${urlEndpoint}/client/projects/${projectId}/users/events`)
    })

    it('prefixes user scheduled', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })
        await client.user.schedule.upsert({
            name: 'r',
            identifier: [{ externalId: 'u' }],
            scheduledAt: new Date().toISOString(),
        })
        expect(lastUrl()).toBe(`${urlEndpoint}/client/projects/${projectId}/users/scheduled`)
    })

    it('prefixes organizations', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })
        await client.organization.upsert({ identifier: [{ externalId: 'org-1' }] })
        expect(lastUrl()).toBe(`${urlEndpoint}/client/projects/${projectId}/organizations`)
    })

    it('prefixes organization member operations (path override)', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })
        await client.organization.addUser({
            organization: { identifier: [{ externalId: 'org-1' }] },
            user: { identifier: [{ externalId: 'user-1' }] },
        })
        expect(lastUrl()).toBe(`${urlEndpoint}/client/projects/${projectId}/organizations/users`)
    })

    it('prefixes organization events', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })
        await client.organization.events.post([{ name: 'evt', identifier: [{ externalId: 'o' }], data: {} }])
        expect(lastUrl()).toBe(`${urlEndpoint}/client/projects/${projectId}/organizations/events`)
    })

    it('does not double-prefix on repeated calls', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })
        await client.user.upsert({ identifier: [{ externalId: 'a' }] })
        await client.user.upsert({ identifier: [{ externalId: 'b' }] })
        for (const call of fetchMock.mock.calls) {
            expect(urlOf(call[0])).toBe(`${urlEndpoint}/client/projects/${projectId}/users`)
        }
    })
})

describe('request encoding', () => {
    let fetchMock: ReturnType<typeof mockFetch>

    beforeEach(() => {
        fetchMock = mockFetch()
        vi.stubGlobal('fetch', fetchMock)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    async function lastRequest(): Promise<Request> {
        const call = fetchMock.mock.calls.at(-1)
        return call?.[0] as Request
    }

    it('sends the Bearer auth header', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })
        await client.user.upsert({ identifier: [{ externalId: 'user-1' }] })
        const request = await lastRequest()
        expect(request.headers.get('Authorization')).toBe(`Bearer ${apiKey}`)
    })

    it('maps the camelCase facade payload to snake_case on the wire', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })
        await client.user.upsert({
            identifier: [{ externalId: 'user-1' }],
            email: 'a@b.com',
        })
        const body = await (await lastRequest()).clone().json()
        expect(body).toEqual({
            identifier: [{ external_id: 'user-1' }],
            email: 'a@b.com',
        })
    })
})

describe('extended Client API endpoints', () => {
    let fetchMock: ReturnType<typeof mockFetch>

    beforeEach(() => {
        fetchMock = mockFetch()
        vi.stubGlobal('fetch', fetchMock)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    function lastUrl(): string {
        const call = fetchMock.mock.calls.at(-1)
        const input = call?.[0]
        return input instanceof Request ? input.url : String(input)
    }

    function lastPath(): string {
        return new URL(lastUrl()).pathname
    }

    const base = `/api/client/projects/${projectId}`

    it('prefixes user inbox create/query/count/read/archived', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })

        await client.user.inbox.create([
            { target: [{ externalId: 'u' }], identifier: { externalId: 'm1' }, channel: 'inbox' },
        ])
        expect(lastPath()).toBe(`${base}/users/inbox`)

        await client.user.inbox.query({ source: 'default', externalId: 'u', channel: 'inbox' })
        expect(lastPath()).toBe(`${base}/users/inbox`)

        await client.user.inbox.count({ source: 'default', externalId: 'u', channel: 'inbox' })
        expect(lastPath()).toBe(`${base}/users/inbox/count`)

        await client.user.inbox.markRead([{ target: [{ externalId: 'u' }], messageId: 'm1' }])
        expect(lastPath()).toBe(`${base}/users/inbox/read`)

        await client.user.inbox.markArchived([{ target: [{ externalId: 'u' }], messageId: 'm1' }])
        expect(lastPath()).toBe(`${base}/users/inbox/archived`)
    })

    it('maps inbox query params to snake_case on the wire', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })
        await client.user.inbox.query({
            source: 'default',
            externalId: 'u',
            channel: 'inbox',
            messageSource: 'campaign',
        })
        const query = new URL(lastUrl()).searchParams
        expect(query.get('external_id')).toBe('u')
        expect(query.get('message_source')).toBe('campaign')
        expect(query.get('channel')).toBe('inbox')
    })

    it('prefixes user device registration', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })
        await client.user.devices.register({
            identifier: [{ externalId: 'u' }],
            deviceId: 'device-1',
            config: { token: 'tok' },
        })
        expect(lastPath()).toBe(`${base}/users/devices`)
    })

    it('prefixes organization inbox operations', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })

        await client.organization.inbox.create([
            { target: [{ externalId: 'o' }], identifier: { externalId: 'm1' }, channel: 'inbox' },
        ])
        expect(lastPath()).toBe(`${base}/organizations/inbox`)

        await client.organization.inbox.query({ source: 'default', externalId: 'o', channel: 'inbox' })
        expect(lastPath()).toBe(`${base}/organizations/inbox`)
    })

    it('prefixes the VAPID public key endpoint', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })
        await client.push.getVapidPublicKey()
        expect(lastPath()).toBe(`${base}/push/vapid`)
    })

    it('prefixes session minting with the auth method in the path', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })
        const authMethodId = '22222222-2222-4222-8222-222222222222'
        await client.sessions.create(authMethodId, { userId: 'user-1' })
        expect(lastPath()).toBe(`${base}/auth-methods/${authMethodId}/sessions`)
    })

    it('maps a session request body to snake_case on the wire', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })
        await client.sessions.create('22222222-2222-4222-8222-222222222222', { userId: 'user-1' })
        const call = fetchMock.mock.calls.at(-1)
        const body = await (call?.[0] as Request).clone().json()
        expect(body).toEqual({ user_id: 'user-1' })
    })

    function lastMethod(): string {
        return (fetchMock.mock.calls.at(-1)?.[0] as Request).method
    }

    it('routes the remaining user + organization write endpoints', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })

        await client.user.delete({ identifier: [{ externalId: 'u' }] })
        expect(lastPath()).toBe(`${base}/users`)
        expect(lastMethod()).toBe('DELETE')

        await client.user.schedule.delete({ name: 'r', identifier: [{ externalId: 'u' }] })
        expect(lastPath()).toBe(`${base}/users/scheduled`)
        expect(lastMethod()).toBe('DELETE')

        await client.organization.delete({ identifier: [{ externalId: 'o' }] })
        expect(lastPath()).toBe(`${base}/organizations`)
        expect(lastMethod()).toBe('DELETE')

        await client.organization.removeUser({
            organization: { identifier: [{ externalId: 'o' }] },
            user: { identifier: [{ externalId: 'u' }] },
        })
        expect(lastPath()).toBe(`${base}/organizations/users`)
        expect(lastMethod()).toBe('DELETE')

        await client.organization.schedule.upsert({
            name: 's',
            identifier: [{ externalId: 'o' }],
            scheduledAt: new Date().toISOString(),
        })
        expect(lastPath()).toBe(`${base}/organizations/scheduled`)
        expect(lastMethod()).toBe('POST')

        await client.organization.schedule.delete({ name: 's', identifier: [{ externalId: 'o' }] })
        expect(lastPath()).toBe(`${base}/organizations/scheduled`)
        expect(lastMethod()).toBe('DELETE')
    })

    it('routes the remaining organization inbox endpoints', async () => {
        const client = new Client({ apiKey, projectId, urlEndpoint })

        await client.organization.inbox.count({ source: 'default', externalId: 'o', channel: 'inbox' })
        expect(lastPath()).toBe(`${base}/organizations/inbox/count`)

        await client.organization.inbox.markRead([{ target: [{ externalId: 'o' }], messageId: 'm' }])
        expect(lastPath()).toBe(`${base}/organizations/inbox/read`)

        await client.organization.inbox.markArchived([{ target: [{ externalId: 'o' }], messageId: 'm' }])
        expect(lastPath()).toBe(`${base}/organizations/inbox/archived`)
    })
})

describe('projectId validation', () => {
    it('throws when projectId is missing', () => {
        // @ts-expect-error projectId is required
        expect(() => new Client({ apiKey, urlEndpoint })).toThrow(ValidationError)
    })

    it('throws when projectId is empty', () => {
        expect(() => new Client({ apiKey, projectId: '   ', urlEndpoint })).toThrow(ValidationError)
    })

    it('throws when projectId is not a UUID', () => {
        expect(() => new Client({ apiKey, projectId: 'not-a-uuid', urlEndpoint })).toThrow(ValidationError)
    })
})
