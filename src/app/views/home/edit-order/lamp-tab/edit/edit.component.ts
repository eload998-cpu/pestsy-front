import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { AuthUserService } from 'src/app/services/auth-user.service';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';

import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/views/base/base.component';

//SERVICES
import { LampService as CrudService } from 'src/app/services/administration/lamp.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { generateRandomString } from 'src/app/shared/helpers';

@Component({
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    standalone: false
})
export class EditComponent extends BaseComponent implements OnInit {

  public faArrowLeft = faArrowLeft;
  public faPlus = faPlus;

  public form_model: any;
  public model_form_control: any;
  public last_order: any;
  public sendingForm: boolean = false;
  public workers: any = [];
  public correctiveActions: { id: string; name: string; not_exist?: boolean }[] = [];


  public aplications: Array<Object> = [];
  public locations: Array<Object> = [];
  public products: Array<Object> = [];
  public model: any = null;
  public options = [
    {
      "id": "yes",
      "name": "Si"
    },
    {
      "id": "no",
      "name": "No"
    }
  ];
  public is_mobile = this.sharedService.isMobile;
  public isOperator = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private _authUserService: AuthUserService,
    private sharedService: SharedService,
    private _location: Location,
  ) {


    super(_location);
    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      id: new FormControl(''),
      lamp_not_working: new FormControl('no'),
      station_number: new FormControl(''),
      rubbery_iron_changed: new FormControl(''),
      lamp_cleaning: new FormControl(''),
      fluorescent_change: new FormControl('no'),
      quantity_replaced: new FormControl(''),
      observation: new FormControl(''),
      order_id: new FormControl(''),
      application_time: new FormControl(new Date()),
      worker_id: new FormControl(),
      corrective_actions: new FormControl([]),
      location_id: new FormControl(''),
      product_id: new FormControl(''),
      within_critical_limits: new FormControl('false'),
    });

    this.model_form_control = this.form_model.controls;

    this._authUserService.userObservable.subscribe(
      (authUser: any) => {
        if (authUser) {
          this.form_model.patchValue({
            order_id: authUser.last_order.id
          });
          this.isOperator = authUser.roles.find(item => item.name === 'operator');
        }
      }
    );
  }

  public async getSelectData() {

    let data = await this._crudService.getSelectData({ products: true, locations: true, corrective_action: true, workers: true });
    this.workers = data.workers;
    this.correctiveActions = data.corrective_actions;
    this.locations = data.locations;
    this.products = data.products;

  }


  ngOnInit(): void {

    this.getSelectData();

    this.route.data.subscribe((data: any) => {

      this.model = data.model.data;


      this.form_model.patchValue({
        _method: 'PUT',
        id: this.model.id,
        lamp_not_working: this.model.lamp_not_working,
        station_number: this.model.station_number,
        rubbery_iron_changed: this.model.rubbery_iron_changed,
        lamp_cleaning: this.model.lamp_cleaning,
        fluorescent_change: this.model.fluorescent_change,
        quantity_replaced: this.model.quantity_replaced,
        observation: this.model.observation,
        order_id: this.model.order_id,
        application_time: this.model.application_time,
        worker_id: this.model.worker_id,
        location_id: this.model.location_id,
        corrective_actions: this.model.corrective_actions.map((a: any) => a.corrective_action_id),
        product_id: this.model.product_id,
        within_critical_limits: this.model.within_critical_limits.toString()


      });

    });

  }



  public updateQuantityReplaced(event: any) {
    if (event.target.value == "no") {
      this.form_model.patchValue({
        quantity_replaced: ''
      });
    }
  }


  public async onSubmit(): Promise<void> {

    try {


      if (this.form_model.valid) {

        this.sendingForm = true;
        this.spinner.show();

        if (this.model_form_control.fluorescent_change.value == "yes" && (this.model_form_control.quantity_replaced.value == "" || this.model_form_control.quantity_replaced.value <= 0)) {
          this.toastr.error('El campo cantidad reemplazada esta vacio o es menor que 1', 'Mensaje');
          return;
        }


        if (this.model_form_control.fluorescent_change.value == "no") {
          this.form_model.patchValue({
            quantity_replaced: null
          });
        }

        let resp = await this._crudService.update(this.form_model.get('id').value, this.form_model.value);



        this.spinner.hide();
        this.toastr.success('Lámpara modificada exitosamente', 'Mensaje');



      }
    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }


  public addProduct(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.name;
      this.products = [...this.products, { id: id, name: event.name, not_exist: true }];


      this.form_model.patchValue({ product_id: id });

    }


  }

  public addWorker(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.full_name;
      this.workers = [...this.workers, { id: id, full_name: event.full_name, not_exist: true }];


      this.form_model.patchValue({ worker_id: id });

    }
  }

  public addLocation(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.name;
      this.locations = [...this.locations, { id: id, name: event.name, not_exist: true }];


      this.form_model.patchValue({ location_id: id });

    }


  }

  validateInput(event) {
    const value = event.target.value;
    event.target.value = value.replace(/[^A-Za-zÀ-úñÑ ]/g, '');
  }

  public addCorrectiveAction = (newName: string) => {
    const newId = generateRandomString(3) + '-' + newName;

    const newAction = {
      id: newId,
      name: newName,
      not_exist: true
    };

    this.correctiveActions = [...this.correctiveActions, newAction];

    return newAction;
  };



}
