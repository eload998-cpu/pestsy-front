import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute } from '@angular/router';

//SERVICES
import { OrderService as CrudService } from 'src/app/services/administration/order.service';
import { SharedService } from 'src/app/shared/services/shared.service';

import { AuthUserService } from 'src/app/services/auth-user.service';
import { AuthService } from 'src/app/services/auth.service';
import { generateRandomString } from 'src/app/shared/helpers';
import { Subscription } from 'rxjs';
import { ViewportScroller } from '@angular/common';
import { NgZone } from '@angular/core';

@Component({
    templateUrl: './order-tab.component.html',
    styleUrls: ['./order-tab.component.scss'],
    standalone: false
})
export class OrderTabComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('formElement') formRef!: ElementRef<HTMLElement>;

  public faArrowLeft = faArrowLeft;
  public faPlus = faPlus;

  public form_model: any;
  public model_form_control: any;

  public sendingForm: boolean = false;
  public clients: any = [];
  public workers: any = [];
  public bsValue = new Date();
  public is_mobile = this._sharedService.isMobile;
  public role: string;
  public authEmail: string;

  public service_types: any =
    [
      { value: "General", selected: true },
      { value: "Fumigación", selected: false },
      { value: "Control de roedores", selected: false },
      { value: "Monitoreo de voladores (lámparas)", selected: false },
      { value: "Monitoreo de insectos", selected: false },
      { value: "Legionela", selected: false },
      { value: "Xilofago", selected: false }
    ];

  public order_type: string = "";

  public authUserSubscription!: Subscription;
  public sharedServiceSubscription!: Subscription;
  public routeSubscription!: Subscription;
  public isOperator = false;

  @Output() lastOrderOutput = new EventEmitter<any>();

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private route: ActivatedRoute,
    private _authUserService: AuthUserService,
    private _authService: AuthService,
    private _sharedService: SharedService,
    private scroller: ViewportScroller,
    private zone: NgZone

  ) {
    this.toastr.clear();



    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      action: new FormControl('UPDATE'),
      id: new FormControl(''),
      order_number: new FormControl(''),
      status: new FormControl('pending'),
      client_id: new FormControl('',
        [Validators.required],
      ),
      worker_id: new FormControl(''),
      date: new FormControl(),
      origin: new FormControl(null),
      direction: new FormControl(null),
      service_type: new FormControl(null),
      arrive_time: new FormControl(null),
      start_time: new FormControl(null),
      end_time: new FormControl(null),
      external_conditions: new FormGroup({
        obsolete_machinery: new FormControl('comply'),
        sewer_system: new FormControl('comply'),
        debris: new FormControl('comply'),
        green_areas: new FormControl('comply'),
        containers: new FormControl('comply'),
        waste: new FormControl('comply'),
        spotlights: new FormControl('comply'),
        nesting: new FormControl('comply'),
        product_storage: new FormControl('comply'),

      }),
      internal_conditions: new FormGroup({
        walls: new FormControl('comply'),
        roofs: new FormControl('comply'),
        floors: new FormControl('comply'),
        cleaning: new FormControl('comply'),
        sealings: new FormControl('comply'),
        closed_doors: new FormControl('comply'),
        windows: new FormControl('comply'),
        pests_facilities: new FormControl('comply'),
        storage: new FormControl('comply'),
        garbage_cans: new FormControl('comply'),
        space: new FormControl('comply'),
        equipment: new FormControl('comply'),
        evidences: new FormControl('comply'),
        ventilation: new FormControl('comply'),
        clean_walls: new FormControl('comply'),
        ducts: new FormControl('comply')

      }),
      pests: new FormGroup({
        german_cockroaches: new FormControl('A'),
        american_cockroaches: new FormControl('A'),
        flies: new FormControl('A'),
        ants: new FormControl('A'),
        bees: new FormControl('A'),
        fire_ants: new FormControl('A'),
        termites: new FormControl('A'),
        spiders: new FormControl('A'),
        fleas: new FormControl('A'),
        rodents: new FormControl('A'),
        moths: new FormControl('A'),
        stilt_walkers: new FormControl('A'),
        weevils: new FormControl('A'),
        others: new FormControl('A'),

      }),

    });


    this.model_form_control = this.form_model.controls;

    //LISTON TO EMMITER FROM ORDER COMPONENT
    this.sharedServiceSubscription = _sharedService.changeEmitted$.subscribe(value => {

      switch (value.action) {
        case "finish":
          this.clearForm();
          break;

        case "discard":
          this.clearForm();
          break;

      }
    });

  }


  ngOnInit(): void {

    this.routeSubscription = this.route.data.subscribe((resp: any) => {

      this.role = this._authUserService.user.roles[0].name;
      this.clients = resp.data.clients;
      this.workers = resp.data.workers;
      this.form_model.patchValue({
        order_number: resp.data.last_order_number
      });

      if (this.role == 'operator') {


        this.isOperator = true;

      }

      if (resp.data.order) {
        let order = resp.data.order;
        this.form_model.get('service_type')?.disable();
        this.order_type = order.service_type;

        this.bsValue = new Date(order.date);

        this.form_model.patchValue({
          order_number: order.order_number,
          client_id: order.client_id,
          worker_id: order.worker_id,
          date: order.date,
          origin: order.origin,
          direction: order.direction,
          service_type: order.service_type,
          arrive_time: new Date(order.arrive_time),
          start_time: new Date(order.start_time),
          end_time: new Date(order.end_time),
          id: order.id
        });

        if (this.order_type == "General") {
          this.form_model.get('external_conditions').patchValue({
            obsolete_machinery: order.external_condition.obsolete_machinery,
            sewer_system: order.external_condition.sewer_system,
            debris: order.external_condition.debris,
            green_areas: order.external_condition.green_areas,
            containers: order.external_condition.containers,
            waste: order.external_condition.waste,
            spotlights: order.external_condition.spotlights,
            nesting: order.external_condition.nesting,
            product_storage: order.external_condition.product_storage,
          });


          this.form_model.get('internal_conditions').patchValue({
            walls: order.internal_condition.walls,
            roofs: order.internal_condition.roofs,
            cleaning: order.internal_condition.cleaning,
            sealings: order.internal_condition.sealings,
            closed_doors: order.internal_condition.closed_doors,
            windows: order.internal_condition.windows,
            pests_facilities: order.internal_condition.pests_facilities,
            storage: order.internal_condition.storage,
            garbage_cans: order.internal_condition.garbage_cans,
            space: order.internal_condition.space,
            equipment: order.internal_condition.equipment,
            evidences: order.internal_condition.evidences,
            ventilation: order.internal_condition.ventilation,
            clean_walls: order.internal_condition.clean_walls,
            ducts: order.internal_condition.ducts,
            floors: order.internal_condition.floors
          });


          this.form_model.get('pests').patchValue({
            german_cockroaches: order.infestation_grade.german_cockroaches,
            american_cockroaches: order.infestation_grade.american_cockroaches,
            flies: order.infestation_grade.flies,
            ants: order.infestation_grade.ants,
            bees: order.infestation_grade.bees,
            fire_ants: order.infestation_grade.fire_ants,
            termites: order.infestation_grade.termites,
            spiders: order.infestation_grade.spiders,
            fleas: order.infestation_grade.fleas,
            rodents: order.infestation_grade.rodents,
            moths: order.infestation_grade.moths,
            stilt_walkers: order.infestation_grade.stilt_walkers,
            weevils: order.infestation_grade.weevils,
            others: order.infestation_grade.others,
          });

        }



      }
    });




  }




  public fixDate(d: Date): Date {
    d.setHours(d.getHours() - d.getTimezoneOffset() / 60);
    return d;
  }


  public format() {
    let inputDate = new Date();
    let date, month, year;
    date = inputDate.getDate();
    month = inputDate.getMonth() + 1;
    year = inputDate.getFullYear();
    date = date.toString().padStart(2, '0');
    month = month.toString().padStart(2, '0');
    return `${date}/${month}/${year}`;
  }

  public async onSubmit(): Promise<void> {

    try {

      this._authService.getAuthUser()

      const order_date = new Date(this.bsValue);
      order_date.setHours(0, 0, 0);


      if (this.form_model.valid) {


        this.form_model.patchValue({
          arrive_time: this.fixDate(this.model_form_control.arrive_time.value),
          start_time: this.fixDate(this.model_form_control.start_time.value),
          end_time: this.fixDate(this.model_form_control.end_time.value),
          date: order_date,

        });

        this.sendingForm = true;
        this.spinner.show();
        this.form_model.get('service_type')?.enable();

        let resp = await this._crudService.store(this.form_model.value);
        this.form_model.get('service_type')?.disable();

        await this._authService.getAuthUser();


        this.spinner.hide();
        this.toastr.success('Orden Modificada exitosamente', 'Mensaje');



      }
    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

      this.scrollFormIntoView();
    }
  }

  public clearForm(): void {

    this.form_model.controls['client_id'].reset();
    this.form_model.controls['worker_id'].reset();
    this.form_model.controls['origin'].reset();
    this.form_model.controls['direction'].reset();
    this.form_model.controls['service_type'].reset();
    this.form_model.controls['arrive_time'].reset();
    this.form_model.controls['start_time'].reset();
    this.form_model.controls['end_time'].reset();

    this.form_model.patchValue({
      external_conditions:
      {
        obsolete_machinery: 'comply',
        sewer_system: 'comply',
        debris: 'comply',
        green_areas: 'comply',
        containers: 'comply',
        waste: 'comply',
        spotlights: 'comply',
        nesting: 'comply',
        product_storage: 'comply',
      }
    });


    this.form_model.patchValue({
      internal_conditions:
      {
        walls: 'comply',
        roofs: 'comply',
        floors: 'comply',
        cleaning: 'comply',
        sealings: 'comply',
        closed_doors: 'comply',
        windows: 'comply',
        pests_facilities: 'comply',
        storage: 'comply',
        garbage_cans: 'comply',
        space: 'comply',
        equipment: 'comply',
        evidences: 'comply',
        ventilation: 'comply',
        clean_walls: 'comply',
        ducts: 'comply',

      }
    });


    this.form_model.patchValue({
      pests:
      {
        german_cockroaches: 'A',
        american_cockroaches: 'A',
        flies: 'A',
        ants: 'A',
        bees: 'A',
        fire_ants: 'A',
        termites: 'A',
        spiders: 'A',
        fleas: 'A',
        rodents: 'A',
        moths: 'A',
        stilt_walkers: 'A',
        weevils: 'A',
        others: 'A',

      }
    });






  }

  public addClient(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.full_name;
      this.clients = [...this.clients, { id: id, full_name: event.full_name, not_exist: true }];


      this.form_model.patchValue({ client_id: id });

    }


  }


  public addWorker(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.full_name;
      this.workers = [...this.workers, { id: id, full_name: event.full_name, not_exist: true }];


      this.form_model.patchValue({ worker_id: id });

    }
  }

  validateInput(event) {
    const value = event.target.value;
    event.target.value = value.replace(/[^A-Za-zÀ-úñÑ ]/g, '');
  }

  ngOnDestroy() {
    this.authUserSubscription?.unsubscribe();
    this.sharedServiceSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();

  }

  private scrollFormIntoView() {
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        this.formRef?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      requestAnimationFrame(() => {
        this.formRef?.nativeElement.scrollIntoView({ behavior: 'auto', block: 'start' });
      });
    });
  }


}
