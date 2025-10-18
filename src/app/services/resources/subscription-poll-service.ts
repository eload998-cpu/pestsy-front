import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SubscriptionService } from 'src/app/services/administration/subscription.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Injectable({
    providedIn: 'root',
})
export class SubscriptionPollingService {
    private activePolling: { [subscriptionId: string]: boolean } = {};

    constructor(
        private _authService: AuthService,
        private _subscriptionService: SubscriptionService,
        private _sharedService: SharedService,

    ) { }

    async pollSubscriptionStatus(subscriptionId: string) {
        if (this.activePolling[subscriptionId]) {
            return;
        }

        this.activePolling[subscriptionId] = true;

        const pollingInterval = 20000; // Poll every 20 seconds
        const maxPollingTime = 180000; // 3 minutes in milliseconds
        let startTime = Date.now(); // Record the start time of polling

        const poll = async () => {
            try {
                const response = await this._subscriptionService.getSubscriptionDetail(subscriptionId);

                if (response.success) {
                    this._authService.getAuthUser();
                    this._sharedService.emitChange({ action: "finish" });

                    this.activePolling[subscriptionId] = false; // Stop polling
                    return;
                } else if (response.expired) {
                    this._authService.getAuthUser();
                    this._sharedService.emitChange({ action: "finish" });
                    this.activePolling[subscriptionId] = false; // Stop polling
                    return;
                } else {
                    const elapsedTime = Date.now() - startTime;

                    if (elapsedTime >= maxPollingTime) {
                        this.activePolling[subscriptionId] = false;
                        return;
                    }

                    setTimeout(poll, pollingInterval);
                }
            } catch (error) {
                console.error('Polling error:', error);
                this.activePolling[subscriptionId] = false;
                return;
            }
        };

        poll();
    }
}