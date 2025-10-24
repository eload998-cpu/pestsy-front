import { Component, NgZone, OnDestroy } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, ChildrenOutletContexts, NavigationError, NavigationCancel } from '@angular/router';
import { slideInAnimation } from 'src/app/animations/slideAnimation';
import { AppVisibilityService } from 'src/app/shared/services/app-visibility.service';
import { App } from '@capacitor/app';
import { AuthService } from 'src/app/services/auth.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Device, DeviceInfo } from "@capacitor/device";
import { AuthUserService } from 'src/app/services/auth-user.service';
import { SubscriptionPollingService } from 'src/app/services/resources/subscription-poll-service';
import { ThemeService } from './services/theme.service';
import { CapgoUpdaterService } from './services/capgo-updater.service';
import { Subscription } from 'rxjs';

const ANIMATION_DURATION = 500;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        slideInAnimation
    ],
    standalone: false
})
export class AppComponent implements OnDestroy {

  public is_phone: boolean = false;
  public authUser: any;

  public authUserServiceSubscription!: Subscription;

  constructor(
    private router: Router,
    private contexts: ChildrenOutletContexts,
    private appVisibilityService: AppVisibilityService,
    private zone: NgZone,
    private _authService: AuthService,
    private _sharedService: SharedService,
    private _authUserService: AuthUserService,
    private _subscriptionPollService: SubscriptionPollingService,
    private themeService: ThemeService,
    private capgoUpdaterService: CapgoUpdaterService

  ) {

    this.authUserServiceSubscription = this._authUserService.userObservable.subscribe(
      (authUser: any) => {

        if (authUser) {
          this.authUser = authUser;

          if (this.authUser.verify_paypal_subscription) {

            this._subscriptionPollService.pollSubscriptionStatus(this.authUser.paypal_subscription_id);
          }



        }
      }
    );
    this.themeService.applySavedTheme();
    this.handleDeepLinks();


  }



  async ngOnInit() {



    await this.capgoUpdaterService.initialize();

    const deviceInfo = await Device.getInfo();
    if ((deviceInfo as unknown as DeviceInfo).platform != "web") {

      this.is_phone = true;
    }

    if (this.is_phone) {
      this.handleAppStateChanges();

    }

  }

  private handleDeepLinks() {
    App.addListener('appUrlOpen', (event: any) => {
      const url = event.url; // The URL that triggered the app to open
      // Parse the path from the URL (remove domain)
      if (url) {
        const internalPath = url.replace('https://pestsy.castilloapp.com', '');

        // Run inside Angular's zone to trigger navigation
        this.zone.run(() => {
          this.router.navigateByUrl(internalPath);
        });
      }
    });
  }

  private handleAppStateChanges() {
    App.addListener('appStateChange', (state) => {
      this.zone.run(() => {
        if (state.isActive) {

          if ((this.router.url != '/login' && this.router.url != '/registro' && this.router.url != '/recuperar-contrasena' && !this.router.url.startsWith('/cambiar-contrasena'))) {

            this.router.navigateByUrl(this.router.url);
            this._authService.getAuthUser();
            this._sharedService.emitChange({ action: "finish" });

          }

        } else {

          this._authService.cancelPendingRequests();
        }
      });
    });
  }



  getRouteAnimationData() {


    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  ngOnDestroy() {
    this.authUserServiceSubscription?.unsubscribe();


  }
}