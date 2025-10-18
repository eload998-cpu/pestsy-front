import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { faPlus, faTrash, faClock } from '@fortawesome/free-solid-svg-icons';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';
import * as Highcharts from 'highcharts';
import { NoDataOptions } from 'highcharts';
import { faUsers, faCogs, faSignLanguage, faFlask, faSearch, faMale, faUser, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { DashboardService } from 'src/app/services/administration/dashboard.service';
import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import * as moment from 'moment';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { Device, DeviceInfo } from "@capacitor/device";

import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import OfflineExporting from 'highcharts/modules/offline-exporting';
import { Subscription } from 'rxjs';

const noData = require('highcharts/modules/no-data-to-display')



noData(Highcharts)

Highcharts.setOptions({
  lang: {
    noData: 'No hay data para mostrar'
  },
  credits: {
    enabled: false
  }
});

interface Month {
  name: string;
  value: string;
}

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    standalone: false
})



export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('periodSelect', { read: ElementRef, static: false }) el: ElementRef;

  public faUsers = faUsers;
  public faMale = faMale;
  public faUser = faUser;
  public faInfoCircle = faInfoCircle;
  public startDate = null;
  public endDate = null;

  public faCogs = faCogs;
  public faSignLanguage = faSignLanguage;
  public faFlask = faFlask;
  public faSearch = faSearch;
  public bsValue1 = new Date();
  public bsValue2 = new Date();
  public authUser: any;

  public total_orders: number = 0;
  public total_clients: number;
  public total_workers: number;
  public total_devices: number;
  public total_products: number;
  public total_system_users: number;
  public total_operators: number;
  public order_quantity: number;
  public serie_name: string = "Órdenes";
  public subscription_expired: boolean = false;
  public about_expire: any = null;
  public is_mobile = this._sharedService.isMobile;
  public is_desktop = false;

  private _authUserSubscription!: Subscription;

  public graphic_completed: boolean = false;
  public pie_completed: boolean = false;



  public monthRange: Array<Month> = [
    {
      name: 'January',
      value: 'Enero',
    },
    {
      name: 'February',
      value: 'Febrero'
    }, {
      name: 'March',
      value: 'Marzo'
    }, {
      name: 'April',
      value: 'Abril'
    }, {
      name: 'May',
      value: 'Mayo'
    }, {
      name: 'June',
      value: 'Junio'
    }, {
      name: 'July',
      value: 'Julio'
    }, {
      name: 'August',
      value: 'Agosto'
    }
    , {
      name: 'September',
      value: 'Septiembre'
    },
    {
      name: 'October',
      value: 'Octubre'
    },
    {
      name: 'November',
      value: 'Noviembre'
    },
    {
      name: 'December',
      value: 'Diciembre'
    }
  ];
  public form_model: any;
  public model_form_control: any;

  public duration = 5000;
  public series: Array<any> = [];
  public highcharts: any;
  public linechart: any;
  public canRenew: boolean = true;



  constructor(
    private _dashboard_sevice: DashboardService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private _authUserService: AuthUserService,
    private _sharedService: SharedService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private _authService: AuthService

  ) {


    this.route.queryParams.subscribe(params => {
      if (params['mobile_status'] === 'true') {
        this.toastr.success('Plan renovado exitosamente', 'Mensaje');
      }
    });


    let currentYear = new Date().getFullYear();

    let date = new Date();

    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      filter_type: new FormControl('orders'),
      period_filter: new FormControl('daily'),
      date_1: new FormControl(this.subtractMonths(date, 6)),
      date_2: new FormControl(date),
      month_year: new FormControl(currentYear),
      month_1: new FormControl('January'),
      month_2: new FormControl('January'),
      annual_1: new FormControl(currentYear),
      annual_2: new FormControl(currentYear),

    });

    this.model_form_control = this.form_model.controls;
    this.initHighcharts();


  }

  async ngOnInit(): Promise<any> {

    const deviceInfo = await Device.getInfo();

    if ((deviceInfo as unknown as DeviceInfo).platform === "web") {

      this.is_desktop = true;
      Exporting(Highcharts);
      ExportData(Highcharts);
      OfflineExporting(Highcharts);
    }


    this._authService.getAuthUser();
    this._sharedService.emitChange({ action: "finish" });
  }



  public subtractMonths(date: Date, months: number): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - months);
    return newDate;
  }
  public imageCompleted(type: string) {
    switch (type) {
      case 'graphic':
        this.graphic_completed = true;
        break;

      case 'pie':
        this.pie_completed = true;
        break;


    }
  }

  public changeType(element: Event) {

    let el = element.target as HTMLSelectElement;
    let selectedOption = el.options[el.selectedIndex];
    this.serie_name = selectedOption.text;
  }

  public getYears(): Array<number> {
    let x = 2022;
    let years = [];

    years.push(x);

    for (let i = 1; i < 30; i++) {

      years.push(x + i);
    }

    return years;
  }


  public async ngAfterViewInit(): Promise<any> {

    let response = await this._dashboard_sevice.getDashboardData();

    this.total_orders = response.total_orders;
    this.total_clients = response.total_clients;
    this.total_workers = response.total_workers;
    this.total_devices = response.total_devices;
    this.total_products = response.total_products;
    this.total_system_users = response.total_system_users;
    this.total_operators = response.total_operators;
    this.order_quantity = response.subscription_quantity;

    this._authUserSubscription = this._authUserService.userObservable.subscribe(
      (authUser: any) => {

        if (authUser) {
          this.authUser = authUser;

          this.canRenew = ((this.authUser.active_subscription && this.authUser.subscription.name == "Premium") || (!this.authUser.active_subscription && this.authUser.pending_transaction)) ? false : true;
          this.subscription_expired = (this.authUser.company.order_quantity) <= 0 ? true : false;

          this.startDate = moment(authUser.subscription.pivot.start_date, "YYYY-MM-DD").format("DD/MM/YYYY");
          this.endDate = moment(authUser.subscription.pivot.end_date, "YYYY-MM-DD").format("DD/MM/YYYY");

          if (this.authUser.active_subscription) {
            this.endDate = moment(authUser.subscription.pivot.end_date).subtract(3, 'days').format("DD/MM/YYYY");

          }

          let currentDate = moment();
          let dateToCheck = moment(this.authUser.subscription.pivot.end_date);
          dateToCheck = dateToCheck.subtract(3, 'days');
          this.about_expire = (currentDate.isSameOrAfter(dateToCheck, 'day') && this.subscription_expired == false && !this.authUser.active_subscription) ? true : false;

        }
      }
    );


  }

  public async onSubmit(): Promise<any> {
    this.spinner.show();

    let response = await this._dashboard_sevice.filterDates(this.form_model.value);
    this.spinner.hide();

    this.series = response;
    this.initHighcharts();

  }


  public redirect(tab: string) {

    this.router.navigateByUrl(`home/${tab}`);


  }

  public initHighcharts() {


    this.highcharts = Highcharts;
    this.linechart = {
      chart: {
        type: 'column'
      },
      title: {
        align: 'left',
        text: ``
      },
      accessibility: {
        announceNewData: {
          enabled: true
        }
      },
      xAxis: {
        type: 'category'
      },
      yAxis: {
        title: {
          text: `${this.serie_name}`
        }

      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
            enabled: this.is_mobile ? false : true,
            format: `{point.y} en total`
          }
        }
      },

      tooltip: {
        headerFormat: `<span style="font-size:11px">${this.serie_name}</span><br>`,
        pointFormat: `<span style="color:{point.color}">{point.name} </span>: <b>{point.y}</b> en total<br/>`
      },

      series: [{
        name: this.form_model.get('filter_type').value,
        colorByPoint: true,
        data: this.series
      }]

    };


    if (this.is_desktop) {
      this.linechart.exporting = {
        enabled: true,
        buttons: {
          contextButton: {
            menuItems: [
              'downloadPNG',
              'downloadJPEG',
              'downloadPDF',
              'downloadSVG',
            ],
          },
        },
      }
    }

  }





  ngOnDestroy() {
    this._authUserSubscription?.unsubscribe();

  }



}
