import { Component, OnInit } from '@angular/core';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

import { NgxSpinnerService } from "ngx-spinner";
import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService as CrudService } from 'src/app/services/auth.service';

import * as AOS from 'aos'

@Component({
    selector: 'app-password-recovery',
    templateUrl: './password-recovery.component.html',
    styleUrls: ['./password-recovery.component.scss'],
    standalone: false
})
export class PasswordRecoveryComponent implements OnInit {
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
  ) {

    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      email: new FormControl('',
        [Validators.required,
        Validators.maxLength(30)],
      )

    });

    this.model_form_control = this.form_model.controls;

  }


  public faEnvelope = faEnvelope;
  public faArrowCircleLeft = faArrowCircleLeft;

  public form_model: any;
  public model_form_control: any;

  public sendingForm: boolean = false;

  ngOnInit(): void {
    AOS.init({
      once: true
    });
  }

  public focusFunction(element1: any, element2: any): void {


    element1.classList.remove('to-down');
    element1.classList.add('to-up');




    element2.classList.remove('b-end');
    element2.classList.add('b-start');


  }

  public focusOutFunction(element1: any, element2: any): void {


    element1.classList.remove('to-up');
    element1.classList.add('to-down');


    element2.classList.remove('b-start');
    element2.classList.add('b-end');


  }

  public async onSubmit(): Promise<void> {

    try {


      if (this.form_model.valid) {

        this.sendingForm = true;
        this.spinner.show();

        let resp = await this._crudService.changePassword(this.form_model.value);



        this.clearForm();
        this.spinner.hide();
        this.toastr.success(resp.message, 'Mensaje');



      }
    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }

  private clearForm(): void {
    this.form_model.reset();
    this.sendingForm = false;

  }


}
