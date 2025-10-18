import { Component, OnInit } from '@angular/core';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { NgxSpinnerService } from "ngx-spinner";
import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService as CrudService } from 'src/app/services/auth.service';
import { CustomValidators } from 'src/app/providers/CustomValidators';

import * as AOS from 'aos'

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    standalone: false
})
export class ChangePasswordComponent implements OnInit {
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private active_route: ActivatedRoute
  ) {

    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)]),
      password_confirmation: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50)
      ]),
      token: new FormControl(null)

    },
      [CustomValidators.MatchValidator('password', 'password_confirmation')]

    );

    this.model_form_control = this.form_model.controls;

  }

  public faLock = faLock;
  public faArrowCircleLeft = faArrowCircleLeft;
  public faEye = faEyeSlash;
  public faConfirmEye: any = faEyeSlash;

  public form_model: any;
  public model_form_control: any;

  public sendingForm: boolean = false;
  public displayPassword: boolean = false;
  public displayConfirmPassword: boolean = false;

  ngOnInit(): void {

    AOS.init({
      once: true
    });
  }

  public showPassword() {
    this.faEye = (!this.displayPassword) ? faEye : faEyeSlash;
    this.displayPassword = !this.displayPassword;

  }

  public showConfirmPassword() {
    this.faConfirmEye = (!this.displayConfirmPassword) ? faEye : faEyeSlash;
    this.displayConfirmPassword = !this.displayConfirmPassword;

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
      let token = decodeURIComponent(atob(this.active_route.snapshot.params['token']));
      this.form_model.patchValue({
        token: token
      });


      if (this.form_model.valid) {

        this.sendingForm = true;
        this.spinner.show();

        let resp = await this._crudService.resetPassword(this.form_model.value);


        if (resp.success) {
          this.toastr.success(resp.message, 'Mensaje');

        } else {
          this.toastr.error(resp.message, 'Mensaje');

        }

        this.clearForm();
        this.spinner.hide();

        this.router.navigateByUrl("/login");


      }
    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }

  get passwordMatchError() {
    return (
      this.form_model.getError('mismatch') &&
      this.form_model.get('password_confirmation')?.touched
    );
  }


  private clearForm(): void {
    this.form_model.reset();
    this.sendingForm = false;

  }

}
