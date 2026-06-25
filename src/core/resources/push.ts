import { BaseResource } from './base'
import { VapidPublicKey } from '../../types'

/**
 * Project-level resource for push notification configuration.
 */
export class PushResource extends BaseResource {
    /**
     * Retrieves the project's VAPID public key for Web Push.
     * @returns Promise resolving to the VAPID public key
     */
    async getVapidPublicKey(): Promise<VapidPublicKey> {
        return this.call<VapidPublicKey>(() =>
            this.client.GET('/api/client/projects/{projectID}/push/vapid', {
                params: this.withProject(),
            }),
        )
    }
}
