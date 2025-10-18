import { Component, OnInit, Output, Input, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faBars, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { ThemeService } from 'src/app/services/theme.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements OnInit, OnDestroy {
  public authUser: any;
  public currentTheme: string;
  public authUserServiceSubscription!: Subscription;

  constructor(
    private _authUserService: AuthUserService,
    private themeService: ThemeService

  ) {

    this.authUserServiceSubscription = this._authUserService.userObservable.subscribe(
      (authUser: any) => {
        this.authUser = authUser;
      }
    );

  }



  toggleDarkMode() {
    this.themeService.toggleTheme();
    this.currentTheme = this.themeService.currentTheme$.value;

  }

  //ICONS
  public bellIcon = faBell;
  public envelopeIcon = faEnvelope;
  public barsIcon = faBars;
  public faAngleDoubleRight = faAngleDoubleRight;
  public faAngleDoubleLeft = faAngleDoubleLeft;
  public faMoon = faMoon;
  public faSun = faSun;

  //END ICONS
  public toggleProfile = false;
  public toggleMSidebar = false;
  public toggleSideBar = false;
  public is_mobile: Boolean = false;
  public profile_completed: boolean = false;



  @HostListener("window:resize", [])
  onResize() {
    var width = window.innerWidth;
    this.is_mobile = width < 575;
  }



  @Output() toogleValue: EventEmitter<any> = new EventEmitter;
  @Output() toogleSideBarValue: EventEmitter<any> = new EventEmitter;
  @Output() toogleMoSideBarValue: EventEmitter<any> = new EventEmitter;

  @Input()
  set closeProfile(value: any) {
    this.toggleProfile = value;
  }


  @Input()
  set closeSide(value: any) {
    this.toggleMSidebar = value;
  }

  ngOnInit(): void {

    let width = window.innerWidth;

    this.is_mobile = width < 575;

    this.currentTheme = this.themeService.currentTheme$.value;

  }

  public toggleMobileSidebar() {
    this.toggleMSidebar = !this.toggleMSidebar;
    this.toggleProfile = false;
    this.toogleMoSideBarValue.emit(this.toggleMSidebar);
    this.toogleValue.emit(this.toggleProfile);

  }

  public toogleProfile() {
    this.toggleProfile = !this.toggleProfile;
    this.toggleMSidebar = false;
    this.toggleSideBar = false;

    this.toogleValue.emit(this.toggleProfile);
    this.toogleMoSideBarValue.emit(this.toggleMSidebar);
    this.toogleSideBarValue.emit(this.toggleSideBar);


  }

  public toggleSide() {
    this.toggleSideBar = !this.toggleSideBar;
    this.toggleProfile = false;
    this.toogleSideBarValue.emit(this.toggleSideBar);
    this.toogleValue.emit(this.toggleProfile);

  }



  public imageCompleted(type: string) {
    switch (type) {
      case 'profile':
        this.profile_completed = true;
        break;

    }
  }

  ngOnDestroy() {
    this.authUserServiceSubscription?.unsubscribe();


  }

}
