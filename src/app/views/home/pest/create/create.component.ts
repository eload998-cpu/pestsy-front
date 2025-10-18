import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

//SERVICES
import { PestService as CrudService } from 'src/app/services/administration/pest.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    standalone: false
})
export class CreateComponent implements OnInit {

  public faArrowLeft = faArrowLeft;
  public faPlus = faPlus;

  public form_model: any;
  public model_form_control: any;

  public sendingForm: boolean = false;
  public is_mobile = this.sharedService.isMobile;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private sharedService: SharedService

  ) {



    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      common_name: new FormControl('',
        [Validators.required,
        Validators.maxLength(40)],
      ),
      scientific_name: new FormControl('',
        [Validators.required,
        Validators.maxLength(40)],
      ),
      is_xylophagus: new FormControl("false"),

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
        this.toastr.success('Plaga registrada exitosamente', 'Mensaje');



      }
    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }

  private clearForm(): void {

    this.form_model.get('common_name').reset('');
    this.form_model.get('scientific_name').reset('');
    this.form_model.get('is_xylophagus').reset('false');
    this.sendingForm = false;

  }


  validateInput(event) {
    const value = event.target.value;
    event.target.value = value.replace(/[^A-Za-zÀ-úñÑ ]/g, '');
  }


}
