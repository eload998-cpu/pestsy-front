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
import { FumigationService as CrudService } from 'src/app/services/administration/fumigation.service';
import { generateRandomString } from 'src/app/shared/helpers';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CustomValidators } from 'src/app/providers/CustomValidators';


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


  public aplications: Array<Object> = [];
  public locations: Array<Object> = [];
  public products: Array<Object> = [];
  public safetyControls: Array<Object> = [];

  public is_mobile = this.sharedService.isMobile;
  public correctiveActions: { id: string; name: string; not_exist?: boolean }[] = [];
  public isOperator = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private _authUserService: AuthUserService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private _location: Location,

  ) {


    super(_location);
    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      aplication_id: new FormControl(''),
      location_id: new FormControl(''),
      product_id: new FormControl(''),
      dose: new FormControl('', [
        Validators.required,
        CustomValidators.DoseWithUnit()
      ]),
      order_id: new FormControl(''),
      application_time: new FormControl(new Date()),
      worker_id: new FormControl(''),
      correctiveActions: new FormControl([]),
      safetyControls: new FormControl([]),
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

    let data = await this._crudService.getSelectData({ safety_controls: true, workers: true, corrective_action: true, aplications: true, locations: true, products: true });
    this.aplications = data.aplications;
    this.locations = data.locations;
    this.products = data.products;
    this.workers = data.workers;
    this.correctiveActions = data.corrective_actions;
    this.safetyControls = data.safety_controls;

  }

  public async onSubmit(): Promise<void> {

    try {


      if (this.form_model.valid) {

        this.sendingForm = true;
        this.spinner.show();

        let resp = await this._crudService.store(this.form_model.value);



        this.clearForm();
        this.spinner.hide();
        this.toastr.success('Fumigación añadida exitosamente', 'Mensaje');



      }
    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }

  private clearForm(): void {

    this.form_model.controls['aplication_id'].reset();
    this.form_model.controls['location_id'].reset();
    this.form_model.controls['product_id'].reset();
    this.form_model.controls['dose'].reset();
    this.form_model.controls['worker_id'].reset();
    this.form_model.controls['application_time'].reset(new Date());
    this.form_model.get('correctiveActions').reset([], { emitEvent: false });
    this.form_model.controls['safetyControls'].reset([], { emitEvent: false });
    this.form_model.controls['within_critical_limits'].reset('false');

    this.sendingForm = false;

  }


  public addApplication(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.name;
      this.aplications = [...this.aplications, { id: id, name: event.name, not_exist: true }];


      this.form_model.patchValue({ aplication_id: id });

    }


  }

  public addLocation(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.name;
      this.locations = [...this.locations, { id: id, name: event.name, not_exist: true }];


      this.form_model.patchValue({ location_id: id });

    }


  }

  public addProduct(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.name;
      this.products = [...this.products, { id: id, name: event.name, not_exist: true }];


      this.form_model.patchValue({ product_id: id });

    }


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
}
