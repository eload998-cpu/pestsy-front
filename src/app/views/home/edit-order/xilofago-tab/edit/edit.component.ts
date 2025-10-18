import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';

//SERVICES
import { XylophageControlService as CRUDService } from 'src/app/services/administration/xylophage-control.service';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { generateRandomString } from 'src/app/shared/helpers';
import { SharedService } from 'src/app/shared/services/shared.service';
import { BaseComponent } from 'src/app/views/base/base.component';
import { Location } from '@angular/common';
import { CustomValidators } from 'src/app/providers/CustomValidators';
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
  public model: any = null;

  public sendingForm: boolean = false;
  public aplications: Array<Object> = [];
  public construction_types: Array<Object> = [];
  public affected_elements: Array<Object> = [];
  public products: Array<Object> = [];
  public pests: Array<Object> = [];

  public infestation_level: Array<String> = ["Bajo", "Medio", "Alto"];

  public is_mobile = this.sharedService.isMobile;
  public bsValue = new Date();
  public bsValue2 = new Date();

  public workers: any = [];
  public locations: Array<Object> = [];
  public correctiveActions: { id: string; name: string; not_exist?: boolean }[] = [];
  public isOperator = false;
  private subscription!: Subscription;

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
      product_id: new FormControl(''),
      pest_id: new FormControl(''),
      aplication_id: new FormControl(''),
      construction_type_id: new FormControl(''),
      affected_element_id: new FormControl(''),
      treatment_date: new FormControl(),
      next_treatment_date: new FormControl(),
      infestation_level: new FormControl(''),
      observation: new FormControl(''),
      worker_id: new FormControl(''),
      location_id: new FormControl(''),
      treated_area_value: new FormControl('', [Validators.min(0)]),
      treated_area_unit: new FormControl('m2'),
      dose: new FormControl('', [
        CustomValidators.DoseWithUnit()
      ]),
      calculated_total_amount: new FormControl(null),
      calculated_total_unit: new FormControl(null),

      pre_humidity: new FormControl(null),
      pre_ventilation: new FormControl(null),
      pre_access: new FormControl(null),
      pre_notes: new FormControl(null),

      post_humidity: new FormControl(null),
      post_ventilation: new FormControl(null),
      post_access: new FormControl(null),
      post_notes: new FormControl(null),
      correctiveActions: new FormControl([]),
      effectiveness_verification: new FormControl('Plaga controlada')
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
        product_id: this.model.product_id,
        pest_id: this.model.pest_id,
        aplication_id: this.model.aplication_id,
        construction_type_id: this.model.construction_type_id,
        affected_element_id: this.model.affected_element_id,
        treatment_date: this.model.treatment_date,
        next_treatment_date: this.model.next_treatment_date,
        infestation_level: this.model.infestation_level,
        observation: this.model.observation,
        location_id: this.model.location_id,
        worker_id: this.model.worker_id,

        treated_area_value: this.model.treated_area_value,
        treated_area_unit: this.model.treated_area_unit,
        dose: this.model.dose,
        calculated_total_amount: this.model.calculated_total_amount,
        calculated_total_unit: this.model.calculated_total_unit,

        pre_humidity: this.model.pre_humidity,
        pre_ventilation: this.model.pre_ventilation,
        pre_access: this.model.pre_access,
        pre_notes: this.model.pre_notes,

        post_humidity: this.model.post_humidity,
        post_ventilation: this.model.post_ventilation,
        post_access: this.model.post_access,
        post_notes: this.model.post_notes,
        effectiveness_verification: this.model.effectiveness_verification,
        correctiveActions: this.model.corrective_actions.map((a: any) => a.corrective_action_id),
      });

    });

    this.subscription = merge(
      this.form_model.get('dose')!.valueChanges,
      this.form_model.get('treated_area_value')!.valueChanges,
      this.form_model.get('treated_area_unit')!.valueChanges
    ).subscribe(() => {
      const dose = this.form_model.get('dose')!.value;
      const area = this.form_model.get('treated_area_value')!.value;
      const res = this.computeTotalFromDose(dose, area);
      this.form_model.patchValue(
        res?.amount != null
          ? { calculated_total_amount: res.amount, calculated_total_unit: res.unit }
          : { calculated_total_amount: null, calculated_total_unit: null },
        { emitEvent: false }
      );
    });

  }

  computeTotalFromDose(dose: string, areaVal: number) {
    const rx = /^\s*(\d+(?:[.,]\d{1,3})?)\s*(ml|g|l|cc)\s*$/i;
    const m = dose?.match(rx);
    if (!m) return null;

    const qty = parseFloat(m[1].replace(',', '.'));   // numeric dose
    const unit = m[2].toLowerCase();                   // ml|g|l|cc
    const area = Number(areaVal);

    if (!area || isNaN(area)) return { amount: null, unit };

    const total = qty * area;
    return { amount: Number(total.toFixed(2)), unit };
  }

  public addPest(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.common_name;
      this.pests = [...this.pests, { id: id, common_name: event.common_name, not_exist: true }];
      this.form_model.patchValue({ pest_id: id });

    }
  }

  public addProduct(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.name;
      this.products = [...this.products, { id: id, name: event.name, not_exist: true }];
      this.form_model.patchValue({ product_id: id });

    }
  }

  public addApplication(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.name;
      this.aplications = [...this.aplications, { id: id, name: event.name, not_exist: true }];


      this.form_model.patchValue({ aplication_id: id });

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

  public addLocation(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.name;
      this.locations = [...this.locations, { id: id, name: event.name, not_exist: true }];


      this.form_model.patchValue({ location_id: id });

    }


  }

  public addConstructionType(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.name;
      this.construction_types = [...this.construction_types, { id: id, name: event.name, not_exist: true }];
      this.form_model.patchValue({ construction_type_id: id });

    }
  }

  public addAffectedElement(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.name;
      this.affected_elements = [...this.affected_elements, { id: id, name: event.name, not_exist: true }];
      this.form_model.patchValue({ affected_element_id: id });

    }
  }

  public addWorker(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.full_name;
      this.workers = [...this.workers, { id: id, full_name: event.full_name, not_exist: true }];


      this.form_model.patchValue({ worker_id: id });

    }
  }


  public async getSelectData() {

    let data = await this._crudService.getSelectData({ corrective_action: true, locations: true, workers: true, aplications: true, construction_types: true, affected_elements: true, products: true, xylophages: true });
    this.aplications = data.aplications;
    this.construction_types = data.construction_types;
    this.affected_elements = data.affected_elements;
    this.products = data.products;
    this.pests = data.pests;
    this.workers = data.workers;
    this.locations = data.locations;
    this.correctiveActions = data.corrective_actions;

  }

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




  public async onSubmit(): Promise<void> {

    try {

      if (this.form_model.valid) {


        let treatment_date = new Date(this.bsValue);
        treatment_date.setHours(0, 0, 0);

        let next_treatment_date = new Date(this.bsValue2);
        next_treatment_date.setHours(0, 0, 0);

        this.form_model.patchValue({
          treatment_date: treatment_date,
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
