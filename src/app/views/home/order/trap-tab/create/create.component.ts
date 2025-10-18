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
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    standalone: false
})
export class CreateComponent extends BaseComponent implements OnInit {

  public faArrowLeft = faArrowLeft;
  public faPlus = faPlus;

  public form_model: any;
  public model_form_control: any;
  public last_order: any;
  public sendingForm: boolean = false;
  public locations: Array<Object> = [];
  public workers: any = [];
  public correctiveActions: { id: string; name: string; not_exist?: boolean }[] = [];


  public devices: Array<Object> = [];
  public products: Array<Object> = [];
  public options = [
    {
      "id": "yes",
      "name": "Si"
    },
    {
      "id": "no",
      "name": "No"
    }
  ]
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

        let resp = await this._crudService.store(this.form_model.value);



        this.clearForm();
        this.spinner.hide();
        this.toastr.success('Trampa añadida exitosamente', 'Mensaje');



      }
    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }

  private clearForm(): void {

    this.form_model.controls['station_number'].reset();
    this.form_model.controls['pheromones'].reset();
    this.form_model.controls['device_id'].reset();
    this.form_model.controls['product_id'].reset();
    this.form_model.controls['worker_id'].reset();
    this.form_model.controls['location_id'].reset();
    this.form_model.controls['application_time'].reset(new Date());
    this.form_model.controls['dose'].reset();
    this.form_model.controls['corrective_actions'].reset([]);
    this.form_model.controls['pheromones_state'].reset("Activa");
    this.form_model.controls['within_critical_limits'].reset('false');

    this.sendingForm = false;

  }



  public addProduct(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.name;
      this.products = [...this.products, { id: id, name: event.name, not_exist: true }];


      this.form_model.patchValue({ product_id: id });

    }


  }

  public addLocation(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.name;
      this.locations = [...this.locations, { id: id, name: event.name, not_exist: true }];


      this.form_model.patchValue({ location_id: id });

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
