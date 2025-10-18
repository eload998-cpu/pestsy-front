import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { AuthUserService } from 'src/app/services/auth-user.service';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from 'src/app/views/base/base.component';
import { Location } from '@angular/common';

//SERVICES
import { TrapService as CrudService } from 'src/app/services/administration/trap.service';
import { generateRandomString } from 'src/app/shared/helpers';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CustomValidators } from 'src/app/providers/CustomValidators';
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
  public devices: Array<Object> = [];
  public products: Array<Object> = [];
  public locations: Array<Object> = [];
  public workers: any = [];
  public correctiveActions: { id: string; name: string; not_exist?: boolean }[] = [];

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
    private _location: Location,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private _authUserService: AuthUserService,
    private sharedService: SharedService

  ) {


    super(_location);
    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      id: new FormControl(''),
      station_number: new FormControl(''),
      pheromones: new FormControl(''),
      device_id: new FormControl(''),
      product_id: new FormControl(''),
      dose: new FormControl('', [
        Validators.required,
        CustomValidators.DoseWithUnit()
      ]),
      order_id: new FormControl(''),
      location_id: new FormControl(''),
      worker_id: new FormControl(''),
      application_time: new FormControl(new Date()),
      corrective_actions: new FormControl([]),
      condition: new FormControl('no'),
      pheromones_state: new FormControl('Activa'),
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

  ngOnInit(): void {

    this.getSelectData();

    this.route.data.subscribe((data: any) => {

      this.model = data.model.data;


      this.form_model.patchValue({
        _method: 'PUT',
        id: this.model.id,
        station_number: this.model.station_number,
        pheromones: this.model.pheromones,
        device_id: this.model.device_id,
        product_id: this.model.product_id,
        dose: this.model.dose,
        order_id: this.model.order_id,
        worker_id: this.model.worker_id,
        application_time: this.model.application_time,
        corrective_actions: this.model.corrective_actions.map((a: any) => a.corrective_action_id),
        condition: this.model.condition,
        location_id: this.model.location_id,
        pheromones_state: this.model.pheromones_state,
        within_critical_limits: this.model.within_critical_limits.toString()
      });

    });

  }


  public async getSelectData() {

    let data = await this._crudService.getSelectData({ corrective_action: true, workers: true, devices: true, products: true, locations: true });
    this.devices = data.devices;
    this.products = data.products;
    this.locations = data.locations;
    this.workers = data.workers;
    this.correctiveActions = data.corrective_actions;


  }



  public async onSubmit(): Promise<void> {

    try {


      if (this.form_model.valid) {

        this.sendingForm = true;
        this.spinner.show();

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

  public addDevice(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.name;
      this.devices = [...this.devices, { id: id, name: event.name, not_exist: true }];


      this.form_model.patchValue({ device_id: id });

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
