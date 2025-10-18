import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { BaseComponent } from 'src/app/views/base/base.component';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute } from '@angular/router';

//SERVICES
import { LegionellaControlService as CRUDService } from 'src/app/services/administration/legionella-control.service';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { generateRandomString } from 'src/app/shared/helpers';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Location } from '@angular/common';
import { merge, Subscription } from 'rxjs';


@Component({
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    standalone: false
})
export class EditComponent extends BaseComponent implements OnInit, OnDestroy {

  public faArrowLeft = faArrowLeft;
  public faPlus = faPlus;
  public faTimes = faTimes;

  public form_model: any;
  public model_form_control: any;

  public sendingForm: boolean = false;
  public locations: Array<Object> = [];
  public desinfection_methods: Array<Object> = [];
  public inspection_result: Array<string> = ["Correcto", "Con anomalías", "Crítico", "Sin acceso", "No aplica"];
  public correctiveActions: { id: string; name: string; not_exist?: boolean }[] = [];
  public aplications: Array<Object> = [];


  public is_mobile = this.sharedService.isMobile;
  public bsValue = new Date();
  public bsValue2 = new Date();
  public workers: any = [];
  public products: Array<Object> = [];
  private subscription!: Subscription;

  public model: any = null;
  public isOperator = false;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CRUDService,
    private _authUserService: AuthUserService,
    private sharedService: SharedService,
    private _location: Location,
  ) {


    super(_location);
    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      id: new FormControl(''),
      order_id: new FormControl(''),
      location_id: new FormControl(''),
      application_id: new FormControl(''),
      inspection_result: new FormControl(''),
      last_treatment_date: new FormControl(),
      next_treatment_date: new FormControl(),
      code: new FormControl(''),
      sample_required: new FormControl(''),
      water_temperature: new FormControl(''),
      residual_chlorine_level: new FormControl(''),
      observation: new FormControl(''),
      correctiveActions: new FormControl([]),
      worker_id: new FormControl(''),
      within_critical_limits: new FormControl('false'),
      product_id: new FormControl(''),
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
        order_id: this.model.order_id,
        location_id: this.model.location_id,
        application_id: this.model.aplication_id,
        inspection_result: this.model.inspection_result,
        last_treatment_date: this.model.last_treatment_date,
        next_treatment_date: this.model.next_treatment_date,
        code: this.model.code,
        sample_required: this.model.sample_required.toString(),
        water_temperature: this.model.water_temperature,
        residual_chlorine_level: this.model.residual_chlorine_level,
        observation: this.model.observation,
        correctiveActions: this.model.corrective_actions.map((a: any) => a.corrective_action_id),
        worker_id: this.model.worker_id,
        within_critical_limits: this.model.within_critical_limits,
        product_id: this.model.product_id,
      });

    });

    this.subscription = merge(
      this.form_model.get('water_temperature').valueChanges,
      this.form_model.get('residual_chlorine_level').valueChanges
    ).subscribe(() => {

      const waterTemperature = this.form_model.get('water_temperature').value;
      const residualChlorineLevel = this.form_model.get('residual_chlorine_level').value

      if (waterTemperature !== '' && residualChlorineLevel !== '') {
        const withinCriticalLimits = (waterTemperature >= 50 && residualChlorineLevel >= 0.5) ? true : false;
        this.form_model.get('within_critical_limits').setValue(withinCriticalLimits.toString());
      }

    });
  }




  public addLocation(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.common_name;
      this.locations = [...this.locations, { id: id, name: event.name, not_exist: true }];

      this.form_model.patchValue({ location_id: id });

    }
  }

  public addApplication(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.name;
      this.aplications = [...this.aplications, { id: id, name: event.name, not_exist: true }];


      this.form_model.patchValue({ application_id: id }, { emitEvent: false });

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


      this.form_model.patchValue({ worker_id: id }, { emitEvent: false });

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

  validateInput(event) {
    const value = event.target.value;
    event.target.value = value.replace(/[^a-zA-Z\s]/g, '');

    const inputValue = this.form_model.client_id.value;
    // Regular expression to match only letters (both uppercase and lowercase) and spaces
    const lettersOnlyValue = inputValue.replace(/[^a-zA-Z\s]/g, '');

    if (inputValue !== lettersOnlyValue) {
      this.form_model.client_id.setValue(lettersOnlyValue);
    }

  }





  public async getSelectData() {

    let data = await this._crudService.getSelectData({ products: true, workers: true, corrective_action: true, aplications: true, locations: true, desinfection_methods: true });
    this.aplications = data.aplications;
    this.locations = data.locations;
    this.correctiveActions = data.corrective_actions;
    this.workers = data.workers;
    this.products = data.products;

  }




  public async onSubmit(): Promise<void> {

    try {

      if (this.form_model.valid) {

        let treatment_date = new Date(this.bsValue);
        treatment_date.setHours(0, 0, 0);

        let next_treatment_date = new Date(this.bsValue2);
        next_treatment_date.setHours(0, 0, 0);

        this.form_model.patchValue({
          last_treatment_date: treatment_date,
          next_treatment_date: next_treatment_date,
        });

        this.sendingForm = true;
        this.spinner.show();
        let resp = await this._crudService.update(this.form_model.get('id').value, this.form_model.value);
        this.spinner.hide();
        this.toastr.success('Registro actualizado exitosamente', 'Mensaje');

      }
    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();

  }

}
