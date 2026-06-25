import { JSONValue } from './common'
import { UserIdentifier } from './request'

/** Operating system a registered device runs on. */
export type DeviceOS = 'web' | 'ios' | 'android'

/** Web Push subscription keys. */
export interface DeviceKeys {
    p256dh: string
    auth: string
}

/** Transport configuration for a device's push subscription. */
export interface DeviceConfig {
    /** Device token for FCM or APNs. */
    token?: string
    /** Web Push subscription endpoint URL. */
    endpoint?: string
    expirationTime?: string | null
    keys?: DeviceKeys
}

/** Request to register or update a device's push subscription for a user. */
export interface DeviceRegistration {
    identifier: UserIdentifier
    deviceId: string
    config: DeviceConfig
    os?: DeviceOS
    osVersion?: string
    model?: string
    appVersion?: string
    data?: Record<string, JSONValue> | null
}

/** The project's VAPID public key for Web Push. */
export interface VapidPublicKey {
    publicKey: string
}
