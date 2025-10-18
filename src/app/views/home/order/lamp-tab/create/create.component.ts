import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { AuthUserService } from 'src/app/services/auth-user.service';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';

//SERVICES
import { LampService as CrudService } from 'src/app/services/administration/lamp.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { generateRandomString } from 'src/app/shared/helpers';
import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/views/base/base.component';

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
  public workers: any = [];
  public correctiveActions: { id: string; name: string; not_exist?: boolean }[] = [];


  public aplications: Array<Object> = [];
  public locations: Array<Object> = [];
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
      lamp_not_working: new FormControl('no'),
      station_number: new FormControl(''),
      rubbery_iron_changed: new FormControl('no'),
      lamp_cleaning: new FormControl('no'),
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

  ngOnInit(): void {
    this.getSelectData();

  }

  public async getSelectData() {

    let data = await this._crudService.getSelectData({ products: true, locations: true, corrective_action: true, workers: true });
    this.workers = data.workers;
    this.correctiveActions = data.corrective_actions;
    this.locations = data.locations;
    this.products = data.products;

  }


  public updateQuantityReplaced(event: any) {

    if (event.id == "no") {
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



        let resp = await this._crudService.store(this.form_model.value);



        this.clearForm();
        this.spinner.hide();
        this.toastr.success('Lámpara añadida exitosamente', 'Mensaje');



      }
    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }

  private clearForm(): void {


    this.form_model.controls['station_number'].reset();
    this.form_model.controls['quantity_replaced'].reset();
    this.form_model.controls['observation'].reset();
    this.form_model.controls['application_time'].reset(new Date());
    this.form_model.controls['worker_id'].reset();
    this.form_model.controls['corrective_actions'].reset([]);
    this.form_model.controls['location_id'].reset();
    this.form_model.controls['product_id'].reset();
    this.form_model.controls['within_critical_limits'].reset('false');


    this.form_model.patchValue({
      lamp_cleaning: "no",
      rubbery_iron_changed: "no",
      fluorescent_change: "no",
      lamp_not_working: "no"
    });

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
