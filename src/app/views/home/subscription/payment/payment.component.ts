import { Component, OnInit, ViewChild } from '@angular/core';
import { faCreditCard, faBank, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SubscriptionService } from 'src/app/services/administration/subscription.service';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthUserService } from 'src/app/services/auth-user.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { showPreconfirmMessage, showAction } from 'src/app/shared/helpers';
import { switchMap, combineLatest } from 'rxjs';
import { PaymentService } from 'src/app/services/resources/payment.service';
import { Browser } from '@capacitor/browser';
import { Device, DeviceInfo } from "@capacitor/device";
import { NgZone } from '@angular/core';

import {
  IPayPalConfig,
  ICreateOrderRequest,
  PayPalScriptService,
  ICreateSubscriptionRequest,
  NgxPaypalComponent
} from 'ngx-paypal';

@Component({
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.scss'],
    standalone: false
})
export class PaymentComponent implements OnInit {

  public faCreditCard = faCreditCard;
  public faBank = faBank;
  public faArrowLeft = faArrowLeft;

  public credit_card = false;
  public paypal = true;
  public bank_transfer = false;
  public zinli = false;

  public date = new Date();
  public day = this.date.getDate().toString().padStart(2, '0');
  public month = (this.date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 to the month since it is zero-based
  public year = this.date.getFullYear().toString();

  public formattedDate = `${this.day}/${this.month}/${this.year}`;

  public bankTransferData: any = {};

  public plan: any = {};
  public bankTab: string = 'banesco';
  public authUser: any;
  public reference: string = '';
  public zinli_reference: string = '';
  public payPalConfig?: IPayPalConfig;
  public is_mobile = this._sharedService.isMobile;
  public proratedCharge = 0;
  public daysLeftInCycle = 0;
  public daylyPrice = 0.10;
  public userStartDate = null;
  public userEndDate = null;
  public is_phone: boolean = false;

  constructor(private route: ActivatedRoute,
    private _subscriptionService: SubscriptionService,
    private spinner: NgxSpinnerService,
    private _authUserService: AuthUserService,
    private toastr: ToastrService,
    protected http: HttpClient,
    private _sharedService: SharedService,
    private _authService: AuthService,
    private payPalScriptService: PayPalScriptService,
    private router: Router,
    private _paymentService: PaymentService,
    private zone: NgZone

  ) {

    this._authUserService.userObservable.subscribe(
      (authUser: any) => {
        this.authUser = authUser;

        this.userEndDate = moment(this.formattedDate, "DD/MM/YYYY") // Parse the date
          .add(1, 'month')
          .format("DD/MM/YYYY");

      }
    );


  }

  async ngOnInit() {


    const deviceInfo = await Device.getInfo();
    if ((deviceInfo as unknown as DeviceInfo).platform != "web") {

      this.is_phone = true;
    }


    combineLatest([
      this.route.queryParams,
      this.route.params
    ]).subscribe(async ([queryParams, routeParams]) => {
      const token = queryParams['token'];
      const planId = routeParams['plan_id'];
      this.plan.id = planId;

    });



    if (this.authUser.country_name == 'Venezuela') {
      this.bankTransferData = await this._paymentService.getBankAmount();

    }

    this.spinner.show();
    this.plan = await this._subscriptionService.getPlanDetail(this.plan.id);

    if (Object.keys(this.plan).length === 0) {
      this.toastr.error('Plan no encontrado', 'Error');
      this.router.navigateByUrl('/home/tablero');
      this.spinner.hide();
      return
    }
    this.spinner.hide();

    this.initConfig();
  }


  private initConfig(): void {


    this.payPalConfig = {
      currency: 'USD',
      clientId: environment.paypalClientId,
      vault: "true",
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
        shape: "pill",
        color: "silver",
        tagline: false,
      },
      onApprove: async (data, actions) => {

        this.spinner.show();
        let dataToSend = {
          plan_id: this.plan.id,
          data: data
        };

        await this.http.post<any>(`${environment.publicUrl}/administracion/payment-success`, dataToSend).toPromise();
        await this._authService.getAuthUser();
        this._sharedService.emitChange({ action: "finish" });

        this.spinner.hide();

        this.toastr.success('Plan renovado exitosamente', 'Mensaje');
        this.router.navigateByUrl('/home/tablero');

        this.initConfig();
      },
      onClientAuthorization: async (data) => {


      },
      onCancel: (data, actions) => {
        this.spinner.hide();

      },
      onError: err => {

        console.log('OnError', err);
        this.spinner.hide();

      },
      onClick: (data, actions) => {
      },
    };


    if (this.authUser.active_subscription) {
      const currentDate = new Date();

      const oldPlanCost = this.authUser.subscription.price;
      const newPlanCost = this.plan.price;
      const billingStartDate = new Date(this.authUser.subscription.pivot.start_date);
      const billingEndDate = new Date(this.authUser.subscription.pivot.end_date);
      this.daysLeftInCycle = 15;

      this.proratedCharge = this.calculateProratedCharge(oldPlanCost, newPlanCost, this.daysLeftInCycle, billingStartDate, billingEndDate);

    } else {

      this.payPalConfig.createSubscriptionOnClient = (data) => <ICreateSubscriptionRequest>{
        plan_id: this.plan.paypal_id
      };

    }


  }


  public async changePlanMobile(): Promise<any> {
    const response = await showPreconfirmMessage(
      "¿Desea cambiar su plan?",
      "Esta acción no es reversible.",
      "warning",
      "Cancelar",
      "Cambiar"
    );

    if (response.isConfirmed) {
      this.spinner.show();

      let dataToSend = {
        plan_id: this.plan.id,
        isMobile: true
      };


      let response = await this.http.post<any>(`${environment.publicUrl}/administracion/change-plan`, dataToSend).toPromise();


      let approvedUrl = response.data.links.find((link) => link.rel == 'approve')?.href;


      if (approvedUrl) {

        await Browser.open({
          url: approvedUrl,
          toolbarColor: '#000000',
        });
        this.router.navigateByUrl('/home/tablero');
        this.spinner.hide();

      } else {
        console.error('Approval URL not found.');
        this.spinner.hide();

      }




    }

  }



  public async changePlan(): Promise<any> {
    const response = await showPreconfirmMessage(
      "¿Desea cambiar su plan?",
      "Esta acción no es reversible.",
      "warning",
      "Cancelar",
      "Cambiar"
    );

    if (response.isConfirmed) {
      this.spinner.show();

      let dataToSend = {
        plan_id: this.plan.id
      };


      let response = await this.http.post<any>(`${environment.publicUrl}/administracion/change-plan`, dataToSend).toPromise();


      let approvedUrl = response.data.links.find((link) => link.rel == 'approve')?.href;


      if (approvedUrl) {

        const newWindow = window.open(approvedUrl, '_blank', 'width=800,height=600');

        if (newWindow) {
          const interval = setInterval(async () => {
            if (newWindow.closed) {
              clearInterval(interval);

              let verf = await this._authService.verifySubscription();

              if (verf.success) {
                await this._authService.getAuthUser();
                this.spinner.hide();
                this.toastr.success('Plan actualizado exitosamente', 'Mensaje');
                this.router.navigateByUrl('/home/tablero');
              } else {
                this.spinner.hide();
              }

            }
          }, 500);
        }
      } else {
        console.error('Approval URL not found.');
        this.spinner.hide();

      }




    }

  }

  public calculateDaysLeftInCycle(currentDate, billingEndDate) {
    const differenceInTime = billingEndDate - currentDate;
    const daysLeftInCycle = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
    return daysLeftInCycle;
  }


  public calculateProratedCharge(oldPlanCost: number, newPlanCost: number, daysLeftInCycle: number, billingStartDate: any, billingEndDate: any) {

    const daysInCycle = (billingEndDate - billingStartDate) / (1000 * 60 * 60 * 24);

    const dailyDifference = (newPlanCost - oldPlanCost) / daysInCycle;

    return dailyDifference * daysLeftInCycle;
  }


  public showBankTab(value: string): void {

    this.bankTab = value


  }


  public showTab(value: string): void {

    this.credit_card = false;
    this.paypal = false;
    this.bank_transfer = false;
    this.zinli = false;

    switch (value) {
      case 'credit_card':
        this.credit_card = true;
        break;

      case 'paypal':
        this.paypal = true;
        break;

      case 'bank_transfer':
        this.bank_transfer = true;
        break;

      case 'zinli':
        this.zinli = true;
        break;
    }
  }



  public async addPlan(id: number): Promise<any> {


    this.spinner.show();
    localStorage.setItem('lastRoute', this.router.url);
    let val = await this._subscriptionService.createMobileSubscription(id);
    this.router.navigateByUrl('/home/tablero');
    this._authService.getAuthUser();
    this._sharedService.emitChange({ action: "finish" });

    await Browser.open({
      url: val.url,
      toolbarColor: '#000000',
    });

    this.spinner.hide();
  }

  public async sendBankTransfer(): Promise<any> {


    const response = await showPreconfirmMessage(
      "Asegurese de que la referencia sea correcta",
      "Su subscripcion se activara en unos minutos.",
      "warning",
      "Cancelar",
      "Enviar"
    );

    if (response.isConfirmed) {

      this.spinner.show();
      await this._subscriptionService.storeBankTransfer(this.reference, this.plan.id, this.bankTransferData);
      await this._authService.getAuthUser();
      this.router.navigateByUrl('/home/tablero');

      this.spinner.hide();
      this.reference = '';
      this.toastr.success('Referencia enviada satisfactoriamente', 'Mensaje');
    }

  }


  public async sendZinliTransfer(): Promise<any> {


    const response = await showPreconfirmMessage(
      "Asegurese de que la referencia sea correcta",
      "Su subscripcion se activara en unos minutos.",
      "warning",
      "Cancelar",
      "Enviar"
    );

    if (response.isConfirmed) {

      this.spinner.show();
      await this._subscriptionService.storeZinliTransfer(this.zinli_reference, this.plan.id);
      await this._authService.getAuthUser();
      this.router.navigateByUrl('/home/tablero');

      this.spinner.hide();
      this.reference = '';
      this.toastr.success('Referencia enviada satisfactoriamente', 'Mensaje');
    }

  }


  public generateBillNumber(): string {
    const alphanumericChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const length = 8; // Adjust the length of the bill number as needed
    let billNumber = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
      billNumber += alphanumericChars[randomIndex];
    }

    return billNumber;
  }


}





