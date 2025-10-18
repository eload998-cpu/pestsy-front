import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { ActivatedRoute, Router } from '@angular/router';

//SERVICES
import { RodentControlService as CRUDService } from 'src/app/services/administration/rodent-control.service';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { generateRandomString } from 'src/app/shared/helpers';
import { SharedService } from 'src/app/shared/services/shared.service';
import { CustomValidators } from 'src/app/providers/CustomValidators';

import { Location } from '@angular/common';
import { BaseComponent } from 'src/app/views/base/base.component';

@Component({
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss'],
    standalone: false
})
export class EditComponent extends BaseComponent implements OnInit {

  public faArrowLeft = faArrowLeft;
  public faPlus = faPlus;
  public faTimes = faTimes;

  public form_model: any;
  public model_form_control: any;
  public workers: any = [];

  public sendingForm: boolean = false;
  public locations: Array<Object> = [];
  public correctiveActions: { id: string; name: string; not_exist?: boolean }[] = [];
  public devices: Array<Object> = [];
  public products: Array<Object> = [];
  public infestation_level: Array<String> = ["Bajo", "Medio", "Alto"];
  public aplications: Array<Object> = [];

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

  public options_cleaning = [
    {
      "id": "acceptable",
      "name": "Aceptable"
    },
    {
      "id": "not acceptable",
      "name": "No Aceptable"
    }
  ];


  public options_bait = [
    {
      "id": "good",
      "name": "Bueno"
    },
    {
      "id": "bad",
      "name": "Malo"
    },
    {
      "id": "wet",
      "name": "Humedo"
    },
    {
      "id": "bitten",
      "name": "Mordido"
    },
    {
      "id": "no bait",
      "name": "Sin cebo"
    },
    {
      "id": "eaten",
      "name": "Comido"
    },
    {
      "id": "eaten by ants",
      "name": "Comido por hormigas"
    },
    {
      "id": "eaten by cockroaches",
      "name": "Comido por cucarachas"
    },
    {
      "id": "eaten by beetles",
      "name": "Comido por coleopteros"
    },
    {
      "id": "wet by larvae",
      "name": "Comido por larvas"
    }

  ];

  public options_activity = [
    {
      "id": "eaten bait",
      "name": "Cebo comido"
    },
    {
      "id": "no activity",
      "name": "Sin actividad"
    },
    {
      "id": "stool",
      "name": "Heces"
    },
    {
      "id": "dead rodent",
      "name": "Roedor Muerto"
    },
    {
      "id": "with activity",
      "name": "Con actividad"
    },
    {
      "id": "live rodent",
      "name": "Roedor vivo"
    },
    {
      "id": "fur",
      "name": "Pelaje"
    },
    {
      "id": "footprints",
      "name": "Huellas"
    },

  ];

  public options_quantity = 100;

  public pests = [];

  public model: any = null;
  public is_mobile = this.sharedService.isMobile;
  public isOperator = false;

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
      order_id: new FormControl(''),
      device_id: new FormControl(''),
      product_id: new FormControl(''),
      device_number: new FormControl(''),
      location_id: new FormControl(''),
      aceptable_cleaning: new FormControl(''),
      finished_cleaning: new FormControl(''),
      bait_status: new FormControl(''),
      dose: new FormControl('', [
        Validators.required,
        CustomValidators.DoseWithUnit()
      ]),
      activity: new FormControl(''),
      bitacores: this.fb.array([]),
      correctiveActions: new FormControl([]),
      observation: new FormControl(''),
      id: new FormControl(''),
      worker_id: new FormControl(''),
      application_time: new FormControl(new Date()),
      infestation_level: new FormControl('', [Validators.required]),
      aplication_id: new FormControl('')
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
        device_id: this.model.device_id,
        product_id: this.model.product_id,
        device_number: this.model.device_number,
        location_id: this.model.location_id,
        aceptable_cleaning: this.model.aceptable_cleaning,
        finished_cleaning: this.model.finished_cleaning,
        bait_status: this.model.bait_status,
        dose: this.model.dose,
        activity: this.model.activity,
        cleaning: this.model.cleaning,
        bait_change: this.model.bait_change,
        observation: this.model.observation,
        correctiveActions: this.model.corrective_actions.map((a: any) => a.corrective_action_id),
        order_id: this.model.order_id,
        worker_id: this.model.worker_id,
        application_time: this.model.application_time,
        infestation_level: this.model.infestation_level,
        aplication_id: this.model.aplication_id
      });


      for (const key in this.model.pest_bitacores) {
        this.form_model.get("bitacores").push(this.fb.group({
          pest_id: this.model.pest_bitacores[key].pest_id,
          quantity: this.model.pest_bitacores[key].quantity,
        }))
      }

    });

  }

  get bitacores(): FormArray {
    return this.form_model.get("bitacores") as FormArray
  }



  public async getSelectData() {

    let data = await this._crudService.getSelectData({ aplications: true, workers: true, corrective_action: true, locations: true, devices: true, products: true, pests: true });
    this.locations = data.locations;
    this.devices = data.devices;
    this.products = data.products;
    this.pests = data.pests;
    this.correctiveActions = data.corrective_actions;
    this.workers = data.workers;
    this.aplications = data.aplications;


  }

  public newElement(): FormGroup {
    return this.fb.group({
      pest_id: '',
      quantity: '',
    })
  }

  public addElement() {
    this.bitacores.push(this.newElement());

  }


  public removeElement(el: number) {
    this.bitacores.removeAt(el);
  }

  public async onSubmit(): Promise<void> {

    try {


      if (this.form_model.valid) {

        this.sendingForm = true;
        this.spinner.show();

        let resp = await this._crudService.update(this.form_model.get('id').value, this.form_model.value);



        this.spinner.hide();
        this.toastr.success('Control de roedor Modificado exitosamente', 'Mensaje');



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

  public addLocation(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.name;
      this.locations = [...this.locations, { id: id, name: event.name, not_exist: true }];


      this.form_model.patchValue({ location_id: id });

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

  public addApplication(event: any) {
    if ("id" in event == false) {

      let id = generateRandomString(3) + '-' + event.name;
      this.aplications = [...this.aplications, { id: id, name: event.name, not_exist: true }];
      this.form_model.patchValue({ aplication_id: id });

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


}
