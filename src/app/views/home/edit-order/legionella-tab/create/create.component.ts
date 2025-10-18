import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { BaseComponent } from 'src/app/views/base/base.component';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';


//SERVICES
import { LegionellaControlService as CRUDService } from 'src/app/services/administration/legionella-control.service';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { generateRandomString } from 'src/app/shared/helpers';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Location } from '@angular/common';
import { merge, Subscription } from 'rxjs';


@Component({
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    standalone: false
})
export class CreateComponent extends BaseComponent implements OnInit, OnDestroy {

  public faArrowLeft = faArrowLeft;
  public faPlus = faPlus;
  public faTimes = faTimes;

  public form_model: any;
  public model_form_control: any;

  public sendingForm: boolean = false;
  public locations: Array<Object> = [];
  public aplications: Array<Object> = [];
  public inspection_result: Array<string> = ["Correcto", "Con anomalías", "Crítico", "Sin acceso", "No aplica"];


  public is_mobile = this.sharedService.isMobile;
  public bsValue = new Date();
  public bsValue2 = new Date();
  public correctiveActions: { id: string; name: string; not_exist?: boolean }[] = [];
  public workers: any = [];
  public isOperator = false;
  public products: Array<Object> = [];
  private subscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
      order_id: new FormControl(this.route.snapshot.params['id']),
      location_id: new FormControl(''),
      application_id: new FormControl(''),
      inspection_result: new FormControl(''),
      last_treatment_date: new FormControl(),
      next_treatment_date: new FormControl(),
      code: new FormControl(''),
      sample_required: new FormControl('false'),
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
          this.isOperator = authUser.roles.find(item => item.name === 'operator');
        }
      }
    );
  }

  ngOnInit(): void {
    this.getSelectData();

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

      let id = generateRandomString(3) + '-' + event.name;
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

  public addWorker(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.full_name;
      this.workers = [...this.workers, { id: id, full_name: event.full_name, not_exist: true }];


      this.form_model.patchValue({ worker_id: id }, { emitEvent: false });

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
        let resp = await this._crudService.store(this.form_model.value);
        this.clearForm();
        this.spinner.hide();
        this.toastr.success('Registro añadido exitosamente', 'Mensaje');

      }
    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }

  private clearForm(): void {



    this.form_model.get('location_id').reset('', { emitEvent: false });
    this.form_model.get('application_id').reset('', { emitEvent: false });
    this.form_model.get('inspection_result').reset('', { emitEvent: false });
    this.form_model.get('last_treatment_date').reset('', { emitEvent: false });
    this.form_model.get('next_treatment_date').reset('', { emitEvent: false });
    this.form_model.get('code').reset('', { emitEvent: false });
    this.form_model.get('sample_required').reset('false', { emitEvent: false });
    this.form_model.get('water_temperature').reset('', { emitEvent: false });
    this.form_model.get('residual_chlorine_level').reset('', { emitEvent: false });
    this.form_model.get('observation').reset('', { emitEvent: false });
    this.form_model.get('correctiveActions').reset('', { emitEvent: false });
    this.form_model.controls['worker_id'].reset('', { emitEvent: false });
    this.form_model.controls['product_id'].reset('', { emitEvent: false });

    this.form_model.patchValue({ last_treatment_date: new Date(), next_treatment_date: new Date() }, { emitEvent: false });
    this.bsValue = new Date();
    this.bsValue2 = new Date();
    this.sendingForm = false;

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();

  }


}
