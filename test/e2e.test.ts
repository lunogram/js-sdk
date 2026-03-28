import { describe, it, expect, beforeAll } from 'vitest'
import { Client } from '../src'

const apiKey = process.env.LUNOGRAM_API_KEY
const urlEndpoint = process.env.LUNOGRAM_API_URL

const userId = `test-user-${Date.now()}`
const orgId = `test-org-${Date.now()}`

let client: Client

beforeAll(() => {
    if (!apiKey) {
        throw new Error('LUNOGRAM_API_KEY environment variable is required')
    }
    client = new Client({ apiKey, urlEndpoint })
})

describe('Users', () => {
    it('should upsert a user', async () => {
        const user = await client.user.upsert({
            identifier: [{ externalId: userId }],
            email: `${userId}@test.example.com`,
            data: { first_name: 'Test', last_name: 'User' },
        })

        expect(user).toBeDefined()
        expect(user.id).toBeDefined()
        expect(user.email).toBe(`${userId}@test.example.com`)
    })

    it('should upsert a user with multiple identifiers', async () => {
        const user = await client.user.upsert({
            identifier: [
                { externalId: userId },
                { source: 'test-suite', externalId: `suite-${userId}` },
            ],
            data: { has_completed_onboarding: true },
        })

        expect(user).toBeDefined()
        expect(user.identifier.length).toBeGreaterThanOrEqual(2)
    })

    it('should post user events', async () => {
        await expect(
            client.user.events.post([
                {
                    name: 'test_event',
                    identifier: [{ externalId: userId }],
                    data: { source: 'integration_test' },
                },
            ]),
        ).resolves.not.toThrow()
    })

    it('should upsert a user scheduled resource', async () => {
        const scheduled = await client.user.schedule.upsert({
            name: 'test_reminder',
            identifier: [{ externalId: userId }],
            scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            data: { reason: 'integration_test' },
        })

        expect(scheduled).toBeDefined()
        expect(scheduled.name).toBe('test_reminder')
    })

    it('should delete a user scheduled resource', async () => {
        await expect(
            client.user.schedule.delete({
                name: 'test_reminder',
                identifier: [{ externalId: userId }],
            }),
        ).resolves.not.toThrow()
    })
})

describe('Organizations', () => {
    it('should upsert an organization', async () => {
        const org = await client.organization.upsert({
            identifier: [{ externalId: orgId }],
            name: 'Test Organization',
            data: { industry: 'testing' },
        })

        expect(org).toBeDefined()
        expect(org.id).toBeDefined()
        expect(org.name).toBe('Test Organization')
    })

    it('should add a user to an organization', async () => {
        await expect(
            client.organization.addUser({
                organization: { identifier: [{ externalId: orgId }] },
                user: { identifier: [{ externalId: userId }] },
                data: { role: 'admin' },
            }),
        ).resolves.not.toThrow()
    })

    it('should post organization events', async () => {
        await expect(
            client.organization.events.post([
                {
                    identifier: [{ externalId: orgId }],
                    name: 'test_org_event',
                    data: { source: 'integration_test' },
                },
            ]),
        ).resolves.not.toThrow()
    })

    it('should upsert an organization scheduled resource', async () => {
        const scheduled = await client.organization.schedule.upsert({
            name: 'test_contract_renewal',
            identifier: [{ externalId: orgId }],
            scheduledAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })

        expect(scheduled).toBeDefined()
        expect(scheduled.name).toBe('test_contract_renewal')
    })

    it('should delete an organization scheduled resource', async () => {
        await expect(
            client.organization.schedule.delete({
                name: 'test_contract_renewal',
                identifier: [{ externalId: orgId }],
            }),
        ).resolves.not.toThrow()
    })

    it('should remove a user from an organization', async () => {
        await expect(
            client.organization.removeUser({
                organization: { identifier: [{ externalId: orgId }] },
                user: { identifier: [{ externalId: userId }] },
            }),
        ).resolves.not.toThrow()
    })
})

describe('Cleanup', () => {
    it('should delete the organization', async () => {
        await expect(
            client.organization.delete({
                identifier: [{ externalId: orgId }],
            }),
        ).resolves.not.toThrow()
    })

    it('should delete the user', async () => {
        await expect(
            client.user.delete({
                identifier: [{ externalId: userId }],
            }),
        ).resolves.not.toThrow()
    })
})
