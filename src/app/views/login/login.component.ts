import { Component, OnInit } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { ThemeService } from 'src/app/services/theme.service';


//SERVICES

import { AuthService } from 'src/app/services/auth.service';
import { AuthUserService } from 'src/app/services/auth-user.service'
import { TokenService } from 'src/app/services/token.service';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import * as AOS from 'aos'
import { environment } from 'src/environments/environment';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Device, DeviceInfo } from "@capacitor/device";


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: [],
    standalone: false
})
export class LoginComponent implements OnInit {


  public form_model: any;
  public model_form_control: any;

  public sendingForm: boolean = false;
  public login_completed: boolean = false;
  public logo_color: boolean;
  public faEye:any = faEyeSlash;
  public faConfirmEye:any = faEyeSlash;
  public displayPassword: boolean = false;
  public currentTheme: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private _authService: AuthService,
    private toastr: ToastrService,
    private _tokenService: TokenService,
    private _authUserService: AuthUserService,
    private themeService: ThemeService

  ) {
    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      email: new FormControl('',
        [Validators.required,
        Validators.maxLength(40)],
      ),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30)]),
        rememberMe:  new FormControl(false),


    });

    this.model_form_control = this.form_model.controls;
  }

  public faUser = faUser;
  public faLock = faLock;

  async ngOnInit(): Promise<any> {
    AOS.init({
      once: true
    });
    this.currentTheme = this.themeService.currentTheme$.value;

    const deviceInfo = await Device.getInfo();

    await GoogleAuth.initialize({
      clientId: environment.googleClientId,
      scopes: ['profile', 'email'],
      grantOfflineAccess: true
    });

    if ((deviceInfo as unknown as DeviceInfo).platform !== "web") {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Dark mode is enabled
        this.logo_color = true;

      } else {
        this.logo_color = false;
      }
    }

    this.loadRememberedCredentials();

  }

  public loadRememberedCredentials(): void {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {

      this.form_model.patchValue({
        email: savedEmail,
        password: savedPassword,
        rememberMe: true
      });
    }
  }


  public showPassword() {
    this.faEye = (!this.displayPassword) ? faEye : faEyeSlash;
    this.displayPassword = !this.displayPassword;

  }


  public imageCompleted(type: string) {
    switch (type) {
      case 'login':
        this.login_completed = true;
        break;

    }
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
        const {email,password,rememberMe } = this.form_model.value;

        await this._authService.login(this.form_model.value);


        this.clearForm();
        this.spinner.hide();

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
          localStorage.setItem('rememberedPassword', password);
        } else {
          localStorage.removeItem('rememberedEmail');
          localStorage.removeItem('rememberedPassword');
        }

        if (this._authUserService.hasRole('system_user')) {
          this.router.navigate(['/home/listar-ordenes/completadas-tab']);

        } else if (this._authUserService.hasRole('operator')) {
          this.router.navigate(['/home/clientes']);

        } else {

          this.router.navigate(['/home/tablero']);

        }



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


  public async googleOauth() {

    try {
      GoogleAuth.signIn().then((googleUser) => {

        try {
          this.router.navigate(['/pre-login'], { state: googleUser });

        } catch (error) {
          console.log(error)
        }

      });


    } catch (error) {

      if (error.code == 12502) {
        GoogleAuth.signIn().then((googleUser) => {

          try {
            this.router.navigate(['/pre-login'], { state: googleUser });

          } catch (error) {
            console.log(error)
          }

        });
      }
    }

  }

  public facebookOauth() {
    window.location.href = environment.webUrl + "/login/auth/facebook";

  }


}
