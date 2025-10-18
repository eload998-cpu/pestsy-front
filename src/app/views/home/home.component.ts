import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, ChildrenOutletContexts } from '@angular/router';
import { slideInAnimation } from 'src/app/animations/slideAnimation';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { HelpService } from 'src/app/shared/services/help.service';
import { TourService } from 'src/app/shared/services/tour.service';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    animations: [
        slideInAnimation
    ],
    standalone: false
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'plagas_v2';

  @ViewChild('profileContainer', { read: ElementRef, static: false }) profileContainer: ElementRef | undefined;
  @ViewChild('content', { read: ElementRef, static: false }) content: ElementRef | undefined;
  @ViewChild('body', { read: ElementRef, static: false }) body: ElementRef | undefined;

  public toggleProfile = null;
  public toggleSideBar = false;
  public toggleMobileSideBar = false;

  public closedProfile = null;
  public isMobile: boolean = false;
  public tutorial_done: boolean = true;
  public order_tutorial_done: boolean = true;

  public start_tutorial: boolean = false;
  public authUser: any;
  public disable_body: boolean;
  public tourServiceSubscription!: Subscription;
  public sharedServiceSubscription!: Subscription;


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    const width = event.target.innerWidth;
    const height = event.target.innerHeight;
    this.isMobile = width <= 500 && height <= 1000;
  }
  constructor(
    private elRef: ElementRef,
    private contexts: ChildrenOutletContexts,
    private _authUserService: AuthUserService,
    private _authService: AuthService,
    private _tourService: TourService,
    private router: Router,
    private _sharedService: SharedService,


  ) {
    this._authUserService.userObservable.subscribe(
      (authUser: any) => this.authUser = authUser
    );

  }



  public ngOnInit(): void {


    this.sharedServiceSubscription = this._sharedService.changeEmitted$.subscribe(value => {

      switch (value.action) {
        case "disableBody":
          this.disable_body = true;
          this.toggleMobileSideBar = false;
          this.toggleSideBar = false;

          break;

        case "enableBody":
          this.disable_body = false;

          break;

      }
    });

    let width = window.innerWidth;
    let height = window.innerHeight;
    this.isMobile = width <= 500 && height <= 1000;
    this.tourServiceSubscription = this._tourService.currentOrderTourValue$
      .subscribe(({ component, step, showTutorial, disableBody }) => {

        if (!this.authUser.tutorial_done) {
          this.start_tutorial = showTutorial;
          this.disable_body = disableBody;
          if (step >= 13 && this.isMobile) {
            this.toggleMobileSideBar = true;
          }
        }
      });

    setTimeout(() => {
      this.tutorial_done = this.authUser.tutorial_done;
      this.order_tutorial_done = this.authUser.order_tutorial_done;
    }, 200);
  }

  public showTutorial() {

    if (this.authUser.roles[0].name != "system_user" && !this.order_tutorial_done) {
      this.router.navigateByUrl('/home/ordenes/orden-tab');
      this._tourService.next({ component: 'create-order', step: 1, showTutorial: true, disableBody: true });
      this.toggleMobileSideBar = false;


    } else {

      if (this.authUser.roles[0].name == "system_user") {
        this._tourService.next({ component: 'sidebar', step: 17, showTutorial: true, disableBody: true });

      } else {

        if (this.authUser.roles[0].name == "operator") {
          this._tourService.next({ component: 'sidebar', step: 14, showTutorial: true, disableBody: true });

        } else {
          this._tourService.next({ component: 'sidebar', step: 13, showTutorial: true, disableBody: true });

        }


      }

    }


    this.disable_body = true;
    this.tutorial_done = true;

  }

  public skipTutorial() {

    this._tourService.next({ component: 'create-order', step: 1, showTutorial: false, disableBody: false });
    this.tutorial_done = true;

    this._authService.skipTutorial();
    this._authService.getAuthUser();

  }


  public closeSide() {
    if (this.authUser.tutorial_done) {
      this.toggleMobileSideBar = false;
    }
  }


  public getRouteAnimationData() {


    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  public ngAfterViewInit(): void {
  }


  public getDisableBody(event: any): void {
    this.disable_body = event;

  }

  public getToggleValue(event: any): void {
    this.toggleProfile = event;

  }

  public getToggleMobileSidebar(event: any): void {
    this.toggleMobileSideBar = event;

  }

  public getToggleSideBarValue(event: any): void {
    this.toggleSideBar = event;

  }


  public getCloseProfile(event: any): void {
    this.toggleProfile = event;



  }

  ngOnDestroy() {
    this.tourServiceSubscription?.unsubscribe();
    this.sharedServiceSubscription?.unsubscribe();
  }


}
