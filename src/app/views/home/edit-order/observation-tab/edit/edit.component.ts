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

  public model:any=null;
  public options=[
    {
      "id":"yes",
      "name":"Si"
    },
    {
      "id":"no",
      "name":"No"
    }
  ];
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
      id:new FormControl(''),
      observation: new FormControl('',[Validators.required]),
      order_id: new FormControl(''),
    });

    this.model_form_control = this.form_model.controls;

    this._authUserService.userObservable.subscribe(
      (authUser: any) => {
       if (authUser) {
          this.form_model.patchValue({
            order_id: authUser.last_order.id
          });  
        }
      }
    );
  }

  ngOnInit(): void {


    this.route.data.subscribe((data: any) => {

      this.model = data.model.data;
  
    
        this.form_model.patchValue({
          _method: 'PUT',
          id:this.model.id,
          observation: this.model.observation,
          order_id:this.model.order_id
  
        });
  
      });

  }




  public async onSubmit(): Promise<void> {

    try {


      if (this.form_model.valid) {

        this.sendingForm = true;
        this.spinner.show();

        let resp = await this._crudService.update(this.form_model.get('id').value,this.form_model.value);



        this.spinner.hide();
        this.toastr.success('Observación modificada exitosamente', 'Mensaje');



      }
    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }




}
