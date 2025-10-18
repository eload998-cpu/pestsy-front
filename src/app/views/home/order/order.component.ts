import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { faPlus, faTrash, faClock, faCheckSquare } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';

import { showPreconfirmMessage } from 'src/app/shared/helpers';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';
import { OrderService as CrudService } from 'src/app/services/administration/order.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { OrderTypeService } from 'src/app/services/order-type.service';
import { Subscription } from 'rxjs';
import { TourService } from 'src/app/shared/services/tour.service';


@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss'],
    standalone: false
})



export class OrderComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('orderTabs') orderTabsRef!: ElementRef<HTMLElement>;

  public order_type: string = "";
  public order_id: any = null;
  private orderTypeSubscription!: Subscription;
  public orderTourServiceSubscription!: Subscription;
  public tourStep: number = 1;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private _authUserService: AuthUserService,
    private _authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private _sharedService: SharedService,
    private _orderTypeService: OrderTypeService,
    private _orderTourService: TourService,
  ) {
    this.orderTypeSubscription = this._orderTypeService.currentOrderTypeObservable.subscribe((orderType: any) => {
      this.order_type = orderType;
    });
  }
  public faPlus = faPlus;
  public faTrash = faTrash;
  public faClock = faClock;
  public faCheckSquare = faCheckSquare;
  public is_mobile = this._sharedService.isMobile;

  public active_tab = 'orden-tab';

  public authUserSubscription!: Subscription;

  public showTutorial = false;

  async ngOnInit(): Promise<void> {


    this.authUserSubscription = this._authUserService.userObservable.subscribe(
      (authUser: any) => {

        if (authUser) {


          this.order_id = (authUser.last_order) ? authUser.last_order : null;
        }

      }
    );

    this._authService.getAuthUser();

    if (this._authUserService.user.last_order) {
      this._orderTypeService.set(this._authUserService.user.last_order.service_type);
    }

    this._sharedService.emitChange({ action: "finish" });

    let url = this.router.url;
    this.active_tab = url.split('/')[3];

    if (this.order_id == null) {
      if (url !== "/home/ordenes/orden-tab") {
        this.router.navigate([`home/ordenes/orden-tab`]);

      }
    }

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // URL has changed
        this.active_tab = event.url.split('/')[3];

      }
    });

    this.orderTourServiceSubscription = this._orderTourService.currentOrderTourValue$
      .subscribe(({ component, step, showTutorial }) => {
        this.tourStep = step;
        this.showTutorial = showTutorial;

        if (this.tourStep == 7) {
          document.querySelector('#view-top').scrollIntoView({
            behavior: 'smooth'
          });
        }

        if (this.tourStep == 2) {
          document.querySelector('#view-top').scrollIntoView({
            behavior: 'smooth'
          });
        }
        if (this.tourStep == 4) {
          document.querySelector('#view-top').scrollIntoView({
            behavior: 'smooth'
          });
        }

      });

  }

  ngAfterViewInit() {


  }




  scrollToStart(): void {
    const el = this.orderTabsRef?.nativeElement;
    if (el) {
      el.scrollTo({
        left: 0,
        behavior: 'smooth'
      });
    }
  }

  scrollToEnd(): void {
    const el = this.orderTabsRef?.nativeElement;
    if (el) {
      el.scrollTo({
        left: el.scrollWidth,
        behavior: 'smooth'
      });
    }
  }

  goToNextStep() {
    this.orderTutorialStep('add');
  }

  goToPrevStep() {
    this.orderTutorialStep('subtract');
  }

  public async orderTutorialStep(operation: string): Promise<void> {
    let componentName: string;
    switch (operation) {
      case 'add':
        this.tourStep++;
        break;

      case 'subtract':
        this.tourStep--
        break;
    }

    switch (this.tourStep) {
      case 1:
        componentName = 'create-order';
        break;
      case 4:
        componentName = 'order-tabs';

        if (this.is_mobile) {
          setTimeout(() => {
            this.scrollToStart();
          }, 100);
        }

        break;

      case 5:
        if (this.is_mobile) {
          setTimeout(() => {
            this.scrollToEnd();
          }, 100);
        }

        break;

    }

    if (this.tourStep == 11) {
      await this.finish(true);
      this.router.navigateByUrl('/home/listar-ordenes/completadas-tab');
    }

    this._orderTourService.next({ component: componentName, step: this.tourStep, showTutorial: true, disableBody: true });
  }

  public changeTab(value: string) {

    if (value != "orden-tab") {
      if (this.order_id == null) {
        this.toastr.error("Cree una orden primero.", "Mensaje");

        return;
      }
    }

    if (!this.showTutorial) {
      this.router.navigate([`home/ordenes/${value}`]);

    }


  }


  public async finish(isTutorial: boolean = false) {

    let response = { isConfirmed: false };
    if (isTutorial) {
      response = { isConfirmed: true };


    } else {
      response = await showPreconfirmMessage(
        "Finalizar orden?",
        "Esta acción no es reversible.",
        "warning",
        "Cancelar",
        "Finalizar"
      );
    }



    if (response.isConfirmed) {

      let data = { order_id: this.order_id.id };

      this.spinner.show();

      await this._crudService.finish(data);

      if (!isTutorial) {
        this.router.navigateByUrl('/home/ordenes/orden-tab');
      }

      this.spinner.hide();
      await this._authService.getAuthUser();
      this._sharedService.emitChange({ action: "finish" });

      this._orderTypeService.next("General");
      this.toastr.success("Orden finalizada con exito.", "Mensaje");

    }
  }



  public async pending() {
    const response = await showPreconfirmMessage(
      "Pasar esta orden a pendiente?",
      "Esta acción no es reversible.",
      "warning",
      "Cancelar",
      "Continuar"
    );

    if (response.isConfirmed) {
      let data = { order_id: this.order_id.id };
      this.spinner.show();

      await this._crudService.pending(data);
      await this._authService.getAuthUser();
      this._sharedService.emitChange({ action: "pending" });
      this.router.navigateByUrl('/home/ordenes/orden-tab');

      this.spinner.hide();

      this._orderTypeService.next("General");

      this.toastr.success("Orden modificada con exito.", "Mensaje");

    }
  }


  public async discard() {
    const response = await showPreconfirmMessage(
      "Descartar orden?",
      "Esta acción no es reversible.",
      "warning",
      "Cancelar",
      "Descartar"
    );

    if (response.isConfirmed) {

      this.spinner.show();

      await this._crudService.delete(this.order_id.id);
      await this._authService.getAuthUser();
      this._sharedService.emitChange({ action: "discard" });
      this.router.navigateByUrl('/home/ordenes/orden-tab');

      this.spinner.hide();
      this._orderTypeService.next("General");


      this.toastr.success("Orden descartada con exito.", "Mensaje");
    }
  }

  ngOnDestroy() {
    this.orderTypeSubscription?.unsubscribe();
    this.authUserSubscription?.unsubscribe();
    this.orderTourServiceSubscription?.unsubscribe();


  }



}
