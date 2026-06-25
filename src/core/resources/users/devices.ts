import { BaseResource } from '../base'
import { DeviceRegistration } from '../../../types'

/**
 * Resource for registering a user's push-capable devices.
 */
export class UserDevicesResource extends BaseResource {
    /**
     * Registers or updates a device's push subscription for a user.
     * @param data - Device registration including identifier, deviceId and config
     */
    async register(data: DeviceRegistration): Promise<void> {
        await this.call<void>(() =>
            this.client.POST('/api/client/projects/{projectID}/users/devices', {
                params: this.withProject(),
                body: data as never,
            }),
        )
    }
}
