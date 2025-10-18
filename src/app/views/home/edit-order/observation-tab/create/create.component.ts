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
import { ObservationService as CrudService } from 'src/app/services/administration/observation.service';


import { Location } from '@angular/common';
import {BaseComponent} from 'src/app/views/base/base.component';
import { SharedService } from 'src/app/shared/services/shared.service';

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


  public devices: Array<Object> = [];
  public products: Array<Object> = [];
  public options=[
    {
      "id":"yes",
      "name":"Si"
    },
    {
      "id":"no",
      "name":"No"
    }
  ]
  public is_mobile = this.sharedService.isMobile;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private _authUserService: AuthUserService,
    private _location: Location,
    private sharedService: SharedService

  ) {


    super(_location);

    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      observation: new FormControl('',[Validators.required]),
      order_id: new FormControl(this.route.snapshot.params['id']),

    });

    this.model_form_control = this.form_model.controls;


  }

  ngOnInit(): void {

  }




  public async onSubmit(): Promise<void> {

    try {


      if (this.form_model.valid) {

        this.sendingForm = true;
        this.spinner.show();

        let resp = await this._crudService.store(this.form_model.value);



        this.clearForm();
        this.spinner.hide();
        this.toastr.success('Observación añadida exitosamente', 'Mensaje');



      }
    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }

  private clearForm(): void {

    this.form_model.controls['observation'].reset();
    this.sendingForm = false;

  }


}
