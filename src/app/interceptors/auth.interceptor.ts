import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenService } from 'src/app/services/token.service';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {



  constructor(
    private errorHandlingService: ErrorHandlingService,
    private tokenService: TokenService,
    private _authService: AuthService,

  ) { }

  public intercept(req: HttpRequest<any>, next: HttpHandler) {


    if (this.tokenService.getToken()) {

      let headers = req.headers;

      headers = headers.set('Authorization', `Bearer ${this.tokenService.getToken()}`);

      req = req.clone({
        headers: headers
      });


    }
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {

          this.errorHandlingService.handle(error);

          return throwError(error);
        })
      );
  }



}