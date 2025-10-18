import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { AuthUserService } from 'src/app/services/auth-user.service';

import { NgForm, FormControl, FormGroup, Validators, FormBuilder, FormArray, AbstractControl } from '@angular/forms';

//DEPENDENCIES
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

//SERVICES
import { ConfigurationService as CrudService } from 'src/app/services/administration/configuration.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { showPreconfirmMessage, showAction } from 'src/app/shared/helpers';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './delete-account.component.html',
    styleUrls: ['./delete-account.component.scss'],
    standalone: false
})
export class DeleteAccountComponent implements OnInit, OnDestroy {

  public faArrowLeft = faArrowLeft;
  public faClose = faClose;


  public sendingForm: boolean = false;
  public is_mobile = this.sharedService.isMobile;
  public reason: string = "";
  private _authUserSubscription!: Subscription;
  public authUser: any;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private sharedService: SharedService,
    private _authService: AuthService,
    private _authUserService: AuthUserService,

  ) {



  }

  ngOnInit(): void {

    this._authUserSubscription = this._authUserService.userObservable.subscribe(
      (authUser: any) => {

        if (authUser) {
          this.authUser = authUser;

        }
      }
    );
  }

  public async onSubmit(): Promise<void> {

    try {



      const response = await showPreconfirmMessage(
        "¿Desea eliminar su cuenta?",
        "Esta acción no es reversible."
      );

      if (response.isConfirmed) {
        this.sendingForm = true;
        this.spinner.show();

        let resp = await this._crudService.deleteAccount(this.reason);
        await this._authService.getAuthUser();

        this.spinner.hide();
        this.toastr.success('Solicitud enviada exitosamente', 'Mensaje');

      }


    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }


  ngOnDestroy() {
    this._authUserSubscription?.unsubscribe();

  }

}
