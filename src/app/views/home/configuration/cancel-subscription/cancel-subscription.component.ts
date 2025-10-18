import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faClose } from '@fortawesome/free-solid-svg-icons';

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

@Component({
    templateUrl: './cancel-subscription.component.html',
    styleUrls: ['./cancel-subscription.component.scss'],
    standalone: false
})
export class CancelSubscriptionComponent implements OnInit {

  public faArrowLeft = faArrowLeft;
  public faClose = faClose;


  public sendingForm: boolean = false;
  public is_mobile = this.sharedService.isMobile;
  public reason: string = "";

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private _crudService: CrudService,
    private sharedService: SharedService,
    private _authService: AuthService

  ) {



  }

  ngOnInit(): void {
  }

  public async onSubmit(): Promise<void> {

    try {



      const response = await showPreconfirmMessage(
        "¿Desea Cancelar la suscripción?",
        "Esta acción no es reversible.",
        "warning",
        "Salir",
        "Cancelar",
      );

      if (response.isConfirmed) {
        this.sendingForm = true;
        this.spinner.show();

        let resp = await this._crudService.cancelSubscription(this.reason);

        this.toastr.success('Suscripción cancelada exitosamente', 'Mensaje');
        await this._authService.getAuthUser();
        this.router.navigateByUrl('/home');
        this.spinner.hide();

      }


    }
    finally {
      this.sendingForm = false;
      this.spinner.hide();

    }
  }




}
