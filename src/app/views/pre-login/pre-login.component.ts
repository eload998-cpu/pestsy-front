import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';


//SERVICES

import { AuthService } from 'src/app/services/auth.service';
import { AuthUserService } from 'src/app/services/auth-user.service'
import { TokenService } from 'src/app/services/token.service';

//DEPENDENCIES
import { environment } from 'src/environments/environment';
import { Device, DeviceInfo } from "@capacitor/device";
import { ThemeService } from 'src/app/services/theme.service';


@Component({
    selector: 'pre-login',
    templateUrl: './pre-login.component.html',
    styleUrls: ['./pre-login.component.scss'],
    animations: [],
    standalone: false
})
export class PreLoginComponent implements OnInit {


  public form_model: any;
  public model_form_control: any;

  public sendingForm: boolean = false;
  public login_completed: boolean = false;
  public authUser: any;
  public user_name:string;
  public logo_color:boolean;
  public currentTheme: string;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private _authService: AuthService,
    private route: ActivatedRoute,
    private _authUserService: AuthUserService,
    private themeService: ThemeService

  ) {


  }

  public async ngOnInit() {
    const deviceInfo = await Device.getInfo();
    this.currentTheme = this.themeService.currentTheme$.value;

    // this.preLogin();
    if ((deviceInfo as unknown as DeviceInfo).platform != "web") {
      

      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Dark mode is enabled
        this.logo_color = true;
  
      } else {
        this.logo_color = false;
      }
    }
 

    const dataReceived = history.state;
    this.user_name = dataReceived.givenName;



    this.preLogin(dataReceived);


  }

  public async preLogin(data:any): Promise<void> {



      try {

        await this._authService.preLogin(data);

  
          if (this._authUserService.hasRole('system_user')) {
            this.router.navigate(['/home/listar-ordenes/completadas-tab']);

          } else if (this._authUserService.hasRole('operator')) {
            this.router.navigate(['/home/clientes']);

          } else {
            this.router.navigate(['/home/tablero']);

          }



      } catch (error) {
        this.router.navigateByUrl('login');
      }




  }


  public imageCompleted(type: string) {
    switch (type) {
      case 'login':
        this.login_completed = true;
        break;

    }
  }






}
