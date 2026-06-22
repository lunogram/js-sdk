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

    function lastUrl(): string {
        const call = fetchMock.mock.calls.at(-1)
        return String(call?.[0])
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
            expect(String(call[0])).toBe(`${urlEndpoint}/client/projects/${projectId}/users`)
        }
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
