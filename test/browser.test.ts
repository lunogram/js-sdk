import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Lunogram } from '../src'

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

describe('Browser identifier injection', () => {
    let fetchMock: ReturnType<typeof mockFetch>

    beforeEach(() => {
        fetchMock = mockFetch()
        vi.stubGlobal('fetch', fetchMock)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
        vi.restoreAllMocks()
    })

    async function lastBody() {
        const call = fetchMock.mock.calls.at(-1)
        return (call?.[0] as Request).clone().json()
    }

    const isAnon = (i: { source: string }) => i.source === 'anonymous'

    it('injects an auto-generated anonymous identifier on upsert', async () => {
        const lunogram = new Lunogram(apiKey, projectId, urlEndpoint)
        await lunogram.user.upsert({ identifier: [{ externalId: 'user-1' }], email: 'a@b.com' })

        const body = await lastBody()
        expect(body.identifier).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ source: 'anonymous' }),
                expect.objectContaining({ source: 'default', external_id: 'user-1' }),
            ]),
        )
        // the anonymous identifier value is a stable, non-empty session id
        const anon = body.identifier.find(isAnon)
        expect(typeof anon.external_id).toBe('string')
        expect(anon.external_id.length).toBeGreaterThan(0)
    })

    it('makes the default external id sticky across subsequent calls', async () => {
        const lunogram = new Lunogram(apiKey, projectId, urlEndpoint)
        // identify once
        await lunogram.user.upsert({ identifier: [{ externalId: 'user-1' }] })
        // a later event carries no identifier — the SDK injects anonymous + sticky default
        await lunogram.user.events.post([{ name: 'page_viewed', data: {} }])

        const body = await lastBody()
        expect(body[0].identifier).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ source: 'anonymous' }),
                expect.objectContaining({ source: 'default', external_id: 'user-1' }),
            ]),
        )
    })

    it('keeps the same anonymous id stable between calls', async () => {
        const lunogram = new Lunogram(apiKey, projectId, urlEndpoint)
        await lunogram.user.upsert({ identifier: [{ externalId: 'a' }] })
        const first = (await lastBody()).identifier.find(isAnon).external_id
        await lunogram.user.upsert({ identifier: [{ externalId: 'b' }] })
        const second = (await lastBody()).identifier.find(isAnon).external_id
        expect(second).toBe(first)
    })

    it('does NOT inject an identifier into match-based events', async () => {
        const lunogram = new Lunogram(apiKey, projectId, urlEndpoint)
        await lunogram.user.events.post([{ name: 'evt', match: { plan: 'pro' }, data: {} }])

        const body = await lastBody()
        expect(body[0].identifier).toBeUndefined()
        expect(body[0].match).toEqual({ plan: 'pro' })
    })

    it('injects the session identifier into scheduled resources', async () => {
        const lunogram = new Lunogram(apiKey, projectId, urlEndpoint)
        await lunogram.user.schedule.upsert({ name: 'trial_end', scheduledAt: '2025-12-25T10:00:00Z' })

        const body = await lastBody()
        expect(body.identifier).toEqual(
            expect.arrayContaining([expect.objectContaining({ source: 'anonymous' })]),
        )
    })

    it('injects the session identifier into device registration', async () => {
        const lunogram = new Lunogram(apiKey, projectId, urlEndpoint)
        await lunogram.user.devices.register({ deviceId: 'device-1', config: { token: 'tok' } })

        const body = await lastBody()
        expect(body.device_id).toBe('device-1')
        expect(body.identifier).toEqual(
            expect.arrayContaining([expect.objectContaining({ source: 'anonymous' })]),
        )
    })

    it('merges a caller-supplied identifier with the anonymous one', async () => {
        const lunogram = new Lunogram(apiKey, projectId, urlEndpoint)
        await lunogram.user.upsert({
            identifier: [{ source: 'stripe', externalId: 'cus_123' }],
        })

        const body = await lastBody()
        expect(body.identifier).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ source: 'anonymous' }),
                expect.objectContaining({ source: 'stripe', external_id: 'cus_123' }),
            ]),
        )
    })
})
