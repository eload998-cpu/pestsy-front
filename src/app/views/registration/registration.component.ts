import { Component, OnInit } from '@angular/core';
import { faBuilding, faUser } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { faPhone,faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Subject, BehaviorSubject, Observable, of, concat, fromEvent } from 'rxjs';
import { distinctUntilChanged, debounceTime, switchMap, tap, catchError, filter, map } from 'rxjs/operators'

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { CustomValidators } from 'src/app/providers/CustomValidators';
import { Router } from '@angular/router';


//SERVICES

import { LocationCountriesService } from 'src/app/services/resources/location-countries.service';
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from 'src/app/services/auth.service';
import { AuthUserService } from 'src/app/services/auth-user.service'

import { ToastrService } from 'ngx-toastr';
import * as AOS from 'aos'
import { environment } from 'src/environments/environment';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss'],
    standalone: false
})
export class RegistrationComponent implements OnInit {

  public form_model;
  public model_form_control;

  public sendingForm: boolean = false;


  public loadingCountries: boolean = false;
  public loadingStates: boolean = false;
  public loadingCities: boolean = false;

  public countries: any[] = [];
  public countriesBuffer: any[] = [];


  public states: any[] = [];
  public statesBuffer: any[] = [];

  public cities: any[] = [];
  public citiesBuffer: any[] = [];
  public displayPassword: boolean = false;
  public displayConfirmPassword: boolean = false;

  public bufferSize = 10;

  public inputCountry$ = new Subject<string>();
  public countryPage: number = 1;

  public inputState$ = new Subject<string>();
  public statePage: number = 1;

  public inputCity$ = new Subject<string>();
  public cityPage: number = 1;


  constructor(
    private fb: FormBuilder,
    private _LocationCountriesService: LocationCountriesService,
    private spinner: NgxSpinnerService,
    private _authService: AuthService,
    private _authUserService: AuthUserService,
    private router: Router,
    private toastr: ToastrService,

  ) {

    this.form_model = new FormGroup({
      _method: new FormControl('POST'),
      first_name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50)

      ]),
      last_name: new FormControl('', [
        Validators.required,
        Validators.maxLength(30)
      ]),
      email: new FormControl('',
        [Validators.required,
        Validators.maxLength(30)],
      ),
      company_name: new FormControl('', [
        Validators.required,
        Validators.maxLength(30)]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30)]),
      password_confirmation: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(30)
      ]),
      cellphone: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
      ]),
      city_id: new FormControl(null, Validators.required),
      state_id: new FormControl(null, Validators.required),
      country_id: new FormControl(null, Validators.required)

    },
      [CustomValidators.MatchValidator('password', 'password_confirmation')]

    );

    this.model_form_control = this.form_model.controls;



  }



  public faUser = faUser;
  public faLock = faLock;
  public faEnvelope = faEnvelope;
  public faGlobe = faGlobe;
  public faPhone = faPhone;
  public faArrowLeft = faArrowLeft;
  public faBuilding = faBuilding;
  public faEye:any = faEyeSlash;
  public faConfirmEye:any = faEyeSlash;

  
  async ngOnInit(): Promise<any> {

    AOS.init({
      once: true
    });
    this.onSearchCountry();

    await GoogleAuth.initialize({
      clientId: environment.googleClientId,
      scopes: ['profile', 'email'],
      grantOfflineAccess: true
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

  public fetchMoreCountries(term: any) {

    this.loadingCountries = true;

    this.countryPage++;
    const len = this.countriesBuffer.length;
    this.getCountries(term).subscribe((resp) => {

      this.loadingCountries = false;
      this.countriesBuffer = this.countriesBuffer.concat(resp);

    });

  }


  public fetchMoreStates(term: any) {

    this.loadingStates = true;

    this.statePage++;
    const len = this.statesBuffer.length;
    this.geStates(term).subscribe((resp) => {

      this.loadingStates = false;
      this.statesBuffer = this.statesBuffer.concat(resp);

    });

  }


  public fetchMoreCities(term: any) {

    this.loadingCities = true;

    this.cityPage++;
    const len = this.citiesBuffer.length;
    this.geCities(term).subscribe((resp) => {

      this.loadingCities = false;
      this.citiesBuffer = this.citiesBuffer.concat(resp);

    });

  }

  public onSearchCountry() {

    this.inputCountry$.pipe(
      distinctUntilChanged(),
      switchMap(term => {
        this.countryPage = 1;
        return this.getCountries(term);
      })
    )
      .subscribe((data) => {
        this.countriesBuffer = data.slice(0, this.bufferSize);

      })


  }


  public onSearchState() {

    this.inputState$.pipe(
      distinctUntilChanged(),
      switchMap(term => {
        this.statePage = 1;
        return this.geStates(term);
      })
    )
      .subscribe((data) => {

        this.statesBuffer = data.slice(0, this.bufferSize);

      })


  }

  public onSearchCity() {

    this.inputCity$.pipe(
      distinctUntilChanged(),
      switchMap(term => {
        this.cityPage = 1;
        return this.geCities(term);
      })
    )
      .subscribe((data) => {

        this.citiesBuffer = data.slice(0, this.bufferSize);

      })


  }



  private getCountries(term: any) {
    return this._LocationCountriesService.getCountries(this.countryPage, term).pipe(map(resp => resp.data.filter((x: { name: string }) => x)))
  }


  private geStates(term: any) {
    return this._LocationCountriesService.getStates(this.statePage, this.form_model.get('country_id')!.value!, term).pipe(map(resp => resp.data.filter((x: { name: string }) => x)))
  }


  private geCities(term: any) {
    return this._LocationCountriesService.getCities(this.cityPage, this.form_model.get('state_id')!.value!, term).pipe(map(resp => resp.data.filter((x: { name: string }) => x)))
  }





  public onChangeCountrySelector(event: any) {

    this.onSearchState();

  }

  public onChangeStateSelector(event: any) {

    this.onSearchCity();


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

        await this._authService.register(this.form_model.value);

        this.clearForm();

        if (this._authUserService.hasRole('system_user')) {
          this.router.navigate(['/home/listar-ordenes/completadas-tab']);

        } else if (this._authUserService.hasRole('operator')) {
          this.router.navigate(['/home/clientes']);

        } else {
          this.router.navigate(['/home/tablero']);

        }


        this.clearForm();
        this.spinner.hide();
        this.toastr.success('Te has registrado exitosamente', 'Mensaje');

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

  public async googleOauth() {

    try {
      const googleUser = await GoogleAuth.signIn();
      this.router.navigate(['/pre-login'], { state: googleUser });

    } catch (error) {
      console.error('Sign-in error:', error);
    }

  }

  public facebookOauth() {
    window.location.href = environment.webUrl + "/login/auth/facebook";

  }


  validateInput(event) {
    const value = event.target.value;
    event.target.value = value.replace(/[^A-Za-zÀ-úñÑ ]/g, '');
  }







}
