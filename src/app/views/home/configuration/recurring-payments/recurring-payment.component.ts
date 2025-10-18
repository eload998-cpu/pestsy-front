import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

//SERVICES
import { ConfigurationService as CrudService } from 'src/app/services/administration/configuration.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { showPreconfirmMessage, showAction } from 'src/app/shared/helpers';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { Browser } from '@capacitor/browser';

@Component({
    templateUrl: './recurring-payment.component.html',
    styleUrls: ['./recurring-payment.component.scss'],
    standalone: false
})
export class RecurringPaymentComponent implements OnInit {

  public faArrowLeft = faArrowLeft;
  public faCheck = faCheck;


  public sendingForm: boolean = false;
  public is_mobile = this.sharedService.isMobile;

  public authUser: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private sharedService: SharedService,
    private _authUserService: AuthUserService,

  ) {

    this._authUserService.userObservable.subscribe(
      (authUser: any) => this.authUser = authUser
    );

  }

  ngOnInit(): void {
  }



  public async onSubmit(): Promise<void> {

    try {

      await Browser.open({
        url: this.authUser.recurring_payment_url,
        toolbarColor: '#000000',
      });


    } catch (error) {
      throw error;

    }



  }
}