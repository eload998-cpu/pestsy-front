import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";
import { TokenService } from 'src/app/services/token.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {
  private exclude: string[] = [
    '/login'
  ];

  constructor(
    private _toastrService: ToastrService,
    private _authService: AuthService,
    private _router: Router,
    private spinnerService: NgxSpinnerService,
    private tokenService: TokenService

  ) { }

  public async handle(error: HttpErrorResponse, closure?: () => any): Promise<void> {
    this.spinnerService.hide();


    if (closure)
      closure();


    switch (true) {
      case (error.status === 500 || error.status === 0):

        if (!this._toastrService.currentlyActive && !this.tokenService.is_expired)
          this._toastrService.error("Intentelo mas tarde.", "Error");
        break;

      case error.status === 403:

        this._toastrService.error("Este usuario no tiene los permisos requeridos para realizar esta accion", "No autorizado");
        this._router.navigateByUrl('/home/no-autorizado');
        break;

      case error.status === 401:

        //	await this._authService.logoutByTokenExpiration();
        break;

      default: //422,... 

        const errors = error.error.errors;
        if (errors) {
          let html = "<ul class='toastr-error-list'>";

          (Object.values(errors) as string[]).forEach(_error => html += "<li>" + _error + "</li>");

          html = html + '</ul>';
          this._toastrService.error(html, "Ups...", { enableHtml: true });
        }

        break;
    }


  }
}