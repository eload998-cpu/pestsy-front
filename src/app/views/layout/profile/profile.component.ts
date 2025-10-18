import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { faUsers, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { AuthUserService } from 'src/app/services/auth-user.service';
import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { CustomValidators } from 'src/app/providers/CustomValidators';
import { AuthService as CrudService } from 'src/app/services/auth.service';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    standalone: false
})
export class ProfileComponent implements OnInit, OnDestroy {
  public authUser: any;
  public form_model: any;
  public model_form_control: any;

  public tab: string = 'user';
  public role_name: string;
  public invalid_phone: boolean = false;
  public invalid_company_phone: boolean = false;
  public invalid_company_direction: boolean = false;
  public image_completed: boolean = false;
  public image_company_completed: boolean = false;
  public is_mobile = this.sharedService.isMobile;
  public displayPassword: boolean = false;
  public displayConfirmPassword: boolean = false;
  public faUsers = faUsers;
  public faBuilding = faBuilding;
  public faEye: any = faEyeSlash;
  public faConfirmEye: any = faEyeSlash;
  public authUserServiceSubscription!: Subscription;

  public sendingForm: boolean = false;
  @ViewChild('profilePic', { read: ElementRef, static: false }) profilePic: ElementRef | undefined;
  @ViewChild('companyPic', { read: ElementRef, static: false }) companyPic: ElementRef | undefined;



  constructor(
    public _authUserService: AuthUserService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _authService: CrudService,
    private sharedService: SharedService

  ) {

    this.authUserServiceSubscription = this._authUserService.userObservable.subscribe(
      (authUser: any) => {
        this.authUser = authUser;

        if (this.authUser) {
          this.role_name = this.authUser.roles[0].display_name;

        }
      }
    );


    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      profile_picture: new FormControl(""),
      first_name: new FormControl(this.authUser.first_name, [
        Validators.required,
        Validators.maxLength(20)

      ]),
      last_name: new FormControl(this.authUser.last_name, [
        Validators.required,
        Validators.maxLength(20)
      ]),
      email: new FormControl({ value: this.authUser.email, disabled: true },
        [Validators.required,
        Validators.maxLength(50)],
      ),
      cellphone: new FormControl(this.authUser.cellphone, [
        Validators.required,
        Validators.maxLength(50)]),
      password: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(50)]),
      password_confirmation: new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(50)
      ]),
      logo: new FormControl(null),
      company_name: new FormControl((this.authUser.hasOwnProperty('company')) ? this.authUser.company.name : null, [
        Validators.maxLength(50)]),
      company_email: new FormControl((this.authUser.hasOwnProperty('company')) ? this.authUser.company.email : null, [
        Validators.maxLength(50),
        Validators.required,

      ]),
      company_phone: new FormControl((this.authUser.hasOwnProperty('company')) ? this.authUser.company.phone : null, [
        Validators.required]),
      company_direction: new FormControl((this.authUser.hasOwnProperty('company')) ? this.authUser.company.direction : '', [
        Validators.required]),


    },
      [CustomValidators.MatchValidator('password', 'password_confirmation')]

    );

    this.model_form_control = this.form_model.controls;

  }

  public faTimes = faTimes;
  public faPlus = faPlus;
  public faSignOut = faSignOut;

  @Output() closeProfile: EventEmitter<any> = new EventEmitter;


  ngOnInit(): void {


  }

  public showPassword() {
    this.faEye = (!this.displayPassword) ? faEye : faEyeSlash;
    this.displayPassword = !this.displayPassword;

  }

  public showConfirmPassword() {
    this.faConfirmEye = (!this.displayConfirmPassword) ? faEye : faEyeSlash;
    this.displayConfirmPassword = !this.displayConfirmPassword;

  }

  public CloseProfile(): void {
    this.closeProfile.emit(false);
  }

  get passwordMatchError() {
    return (
      this.form_model.getError('mismatch') &&
      this.form_model.get('password_confirmation')?.touched
    );
  }

  public changeTab(value: string) {
    this.tab = value;
  }



  public async onSubmit(): Promise<void> {

    try {

      if (this.tab == 'user') {
        if (!this.form_model.get('cellphone').value) {
          this.invalid_phone = true;
        }



        if (!this.invalid_phone) {

          const data = this.form_model.value;
          const formData: FormData = new FormData();
          Object.keys(this.form_model.controls).forEach(key => {

            formData.append(key, this.form_model.controls[key].value ?? "");

          });


          this.sendingForm = true;
          this.spinner.show();
          const response = await this._authService.update(formData)
          if (!response.success) {
            this.toastr.error(response.message, 'Error');
            return;
          }

          await this._authService.getAuthUser();
          this.toastr.success('Información actualizada exitosamente', 'Mensaje');
          this.spinner.hide();

        } else {
          this.invalid_phone = false;

        }
      }

      if (this.tab == 'company') {

        if (this.form_model.get('company_phone').value == '' || this.form_model.get('company_direction').value == null) {
          this.invalid_company_phone = true;
        }

        if (this.form_model.get('company_direction').value == '' || this.form_model.get('company_direction').value == null) {
          this.invalid_company_direction = true;

        }

        if (!this.invalid_company_direction && !this.invalid_company_phone) {


          const data = this.form_model.value;
          const formData: FormData = new FormData();
          Object.keys(this.form_model.controls).forEach(key => {

            formData.append(key, this.form_model.controls[key].value);


          });


          this.sendingForm = true;
          this.spinner.show();
          const response = await this._authService.update(formData)

          await this._authService.getAuthUser();
          this.toastr.success('Información actualizada exitosamente', 'Mensaje');
          this.spinner.hide();

        } else {
          this.invalid_company_phone = false;
          this.invalid_company_direction = false;
        }

      }


    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }

  public uploadFile(event: any): void {


    if (event.target.files.length == 0) {
      return
    }
    let file: File = event.target.files[0];
    let that = this;
    // FileReader support


    this.form_model.patchValue({
      profile_picture: file
    });

    if (FileReader && file) {
      var fr = new FileReader();
      fr.onload = function () {

        that.profilePic!.nativeElement.src = fr.result;
      }
      fr.readAsDataURL(file);
    }

  }

  public imageCompleted() {
    this.image_completed = true;
  }

  public imageCompanyCompleted() {
    this.image_company_completed = true;
  }

  public uploadFileCompany(event: any): void {


    if (event.target.files.length == 0) {
      return
    }
    let file: File = event.target.files[0];
    let that = this;
    // FileReader support


    this.form_model.patchValue({
      logo: file
    });

    if (FileReader && file) {
      var fr = new FileReader();
      fr.onload = function () {

        that.companyPic!.nativeElement.src = fr.result;
      }
      fr.readAsDataURL(file);
    }

  }



  public async logout(): Promise<void> {
    this.closeProfile.emit(false);
    await this._authService.logout();
  }


  validateInput(event) {
    const value = event.target.value;
    event.target.value = value.replace(/[^A-Za-zÀ-úñÑ ]/g, '');
  }

  ngOnDestroy() {
    this.authUserServiceSubscription?.unsubscribe();


  }


}
