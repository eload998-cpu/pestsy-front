import { Component, OnInit, Input, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faCogs } from '@fortawesome/free-solid-svg-icons';
import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { faBug } from '@fortawesome/free-solid-svg-icons';
import { faSignLanguage } from '@fortawesome/free-solid-svg-icons';
import { faFlask } from '@fortawesome/free-solid-svg-icons';
import { faFileText } from '@fortawesome/free-solid-svg-icons';
import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { faSitemap } from '@fortawesome/free-solid-svg-icons';
import { faFile } from '@fortawesome/free-solid-svg-icons';
import { faShield } from '@fortawesome/free-solid-svg-icons';
import { faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { faBinoculars } from '@fortawesome/free-solid-svg-icons';
import { faHospital } from '@fortawesome/free-solid-svg-icons';
import { faTags } from '@fortawesome/free-solid-svg-icons';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';
import { faIdBadge } from '@fortawesome/free-solid-svg-icons';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';
import { faBarChart } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope, faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import { faCog, faBox, faCaretRight, faCaretDown, faBolt, faObjectGroup, faTint, faSuitcase, faCheckCircle } from '@fortawesome/free-solid-svg-icons';


import { Router } from '@angular/router';
import { PermissionService } from 'src/app/services/permission.service';
import { AuthService } from 'src/app/services/auth.service';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { Subscription } from 'rxjs';
import { TourService } from 'src/app/shared/services/tour.service';

interface Menu {
  step: number;
  onlyRole: string;
}

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    standalone: false
})
export class SidebarComponent implements OnInit, OnDestroy {

  constructor(
    public router: Router,
    public _permissionService: PermissionService,
    private _authService: AuthService,
    private _authUserService: AuthUserService,
    private _tourService: TourService,

  ) {


  }

  public menus: Menu[] = [
    { step: 13, onlyRole: 'administrator, super_administrator,fumigator' },
    { step: 14, onlyRole: 'administrator, super_administrator,fumigator, operator' },
    { step: 15, onlyRole: 'administrator, super_administrator,fumigator' },
    { step: 16, onlyRole: 'administrator, super_administrator,fumigator, operator' },
    { step: 17, onlyRole: 'administrator, super_administrator,fumigator, operator,system_user' },
    { step: 18, onlyRole: 'administrator, super_administrator,fumigator, operator' },
    { step: 19, onlyRole: 'administrator, super_administrator,fumigator, operator' },
    { step: 20, onlyRole: 'administrator, super_administrator,fumigator, operator' },
    { step: 21, onlyRole: 'administrator, super_administrator,fumigator, operator' },
    { step: 22, onlyRole: 'administrator, super_administrator,fumigator, operator' },
    { step: 23, onlyRole: 'administrator, super_administrator,fumigator, operator' },
    { step: 24, onlyRole: 'administrator, super_administrator,fumigator, operator' },
    { step: 25, onlyRole: 'administrator, super_administrator,fumigator, operator' },
    { step: 26, onlyRole: 'administrator, super_administrator,fumigator, operator' },
    { step: 27, onlyRole: 'system_user' },
    { step: 28, onlyRole: 'system_user' },
    { step: 29, onlyRole: 'system_user' },
    { step: 30, onlyRole: 'system_user' },
    { step: 31, onlyRole: 'system_user' },
    { step: 32, onlyRole: 'system_user' },
    { step: 33, onlyRole: 'system_user' },
    { step: 34, onlyRole: 'system_user' },
    { step: 35, onlyRole: 'system_user' },
    { step: 36, onlyRole: 'system_user' },
    { step: 37, onlyRole: 'system_user' },
    { step: 38, onlyRole: 'system_user' },
    { step: 39, onlyRole: 'system_user' },
    { step: 40, onlyRole: 'system_user' },

  ];

  public role: string;
  //ICONS
  public usersIcon = faUsers;
  public rightCaretIcon = faAngleRight;
  public faCogs = faCogs;
  public faWrench = faWrench;
  public faCheckSquare = faCheckSquare;
  public faBug = faBug;
  public faSignLanguage = faSignLanguage;
  public faFlask = faFlask;
  public faFileText = faFileText;
  public faFile = faFile;
  public faFolder = faFolder;
  public faSitemap = faSitemap;
  public faShield = faShield;
  public faMapMarker = faMapMarker;
  public faBuilding = faBuilding;
  public faUsers = faUsers;
  public faBinoculars = faBinoculars;
  public faHospital = faHospital;
  public faTags = faTags;
  public faBook = faBook;
  public faBullhorn = faBullhorn;
  public faIdBadge = faIdBadge;
  public faIdCard = faIdCard;
  public faBarChart = faBarChart;
  public faMoneyBill = faMoneyBill;
  public faInfoCircle = faInfoCircle;
  public faEnvelope = faEnvelope;
  public faCog = faCog;
  public faBox = faBox;
  public faCaretRight = faCaretRight;
  public faCaretDown = faCaretDown;
  public faBolt = faBolt;
  public faObjectGroup = faObjectGroup;
  public faTint = faTint;
  public faSuitcase = faSuitcase;
  public faLocationArrow = faLocationArrow;
  public faCheckCircle = faCheckCircle;




  public inventoryDropDownState: boolean = false;
  public inventoryLocationDropDownState: boolean = false;

  public authUserServiceSubscription!: Subscription;




  private authUser: any;


  public selected_menu = 1;
  public tutorial_item = 1;
  public tourServiceSubscription!: Subscription;
  public tourStep: number = 1;
  public hideOrderButton: boolean = false;
  public hideClientPrevButton: boolean = false;

  public operatorFinishButton: boolean = false;

  @Output() disable_body: EventEmitter<any> = new EventEmitter;

  @Input() toggleSideBar: any;

  @Input() start_tutorial: boolean;

  ngOnInit(): void {

    this.authUserServiceSubscription = this._authUserService.userObservable.subscribe(
      (authUser: any) => {
        this.authUser = authUser

        if (this.authUser) {
          this.role = this.authUser.roles[0].name;

          switch (this.role) {
            case 'system_user':
              this.tutorial_item = 5;
              this.hideOrderButton = true;

              break;

            case 'operator':
              this.tutorial_item = 2;
              this.operatorFinishButton = true;
              this.hideClientPrevButton = true;
              break;

            case 'fumigator':
              this.operatorFinishButton = true;
              break;

          }

          if (!this.authUser.tutorial_done) {
            this.inventoryDropDownState = true;
            this.inventoryLocationDropDownState = true;

          }
        }


      }
    );

    this.tourServiceSubscription = this._tourService.currentOrderTourValue$
      .subscribe(({ component, step, showTutorial }) => {
        this.tourStep = step;
      });
  }

  goToNextStep() {
    this.orderTutorialStep('add');
  }

  goToPrevStep() {
    this.orderTutorialStep('subtract');
  }


  public getPreviousStep(): number {
    const currentStep = this.tourStep;
    const descMenu = this.menus.sort((a, b) => b.step - a.step);
    let counter: number = 1;
    for (const elem of descMenu) {
      if (currentStep > elem.step) {
        if (!this._authUserService.hasRoles(elem.onlyRole.split(','))) {
          counter++;
        } else {
          break;
        }

      }
    }
    return counter ? counter : 1;
  }

  public getNextStep(): number {
    const currentStep = this.tourStep;
    const ascMenu = this.menus.sort((a, b) => a.step - b.step);
    let counter: number = 1;
    for (const elem of ascMenu) {
      if (elem.step > currentStep) {
        if (!this._authUserService.hasRoles(elem.onlyRole.split(','))) {
          counter++;
        } else {
          break;
        }

      }
    }
    return counter ? counter : 1;
  }

  public orderTutorialStep(operation: string): void {
    let componentName: string = "sidebar";
    let nextStep!: number;
    switch (operation) {
      case 'add':

        nextStep = this.getNextStep();
        this.tourStep = this.tourStep + nextStep;
        break;

      case 'subtract':

        nextStep = this.getPreviousStep();
        this.tourStep = this.tourStep - nextStep;
        break;
    }

    if (this.tourStep == 22) {
      this.inventoryDropDownState = true;
    }
    if (this.tourStep == 23) {
      this.inventoryDropDownState = false;
    }

    this._tourService.next({ component: componentName, step: this.tourStep, showTutorial: true, disableBody: true });
  }



  public displayDropDown(tab: string) {

    switch (tab) {
      case 'inventory':
        this.inventoryDropDownState = !this.inventoryDropDownState;
        break;

      case 'inventory-location':
        this.inventoryLocationDropDownState = !this.inventoryLocationDropDownState;
        break;

      default:
        break;
    }

  }


  public selectMenu(element: number, url: string = ''): void {

    if (!this.start_tutorial) {

      if (url == "/home/privacidad") {
        window.open("https://castilloapp.com/politicas-de-privacidad", "_blank");
        return;
      }

      this.selected_menu = element;
      this.router.navigate([url]);
    }


  }


  public skipTutorial(): void {
    this.tutorial_item = 99;
    this.start_tutorial = false;
    this._authService.skipTutorial();
    this._authService.getAuthUser();
    this.disable_body.emit(false);

  }


  ngOnDestroy() {
    this.authUserServiceSubscription?.unsubscribe();
    this.tourServiceSubscription?.unsubscribe();

  }

  public async finish(): Promise<void> {
    this._tourService.next({ component: 'create-order', step: 1, showTutorial: false, disableBody: false });
    await this._authService.skipTutorial();
    await this._authService.getAuthUser();

  }



}
