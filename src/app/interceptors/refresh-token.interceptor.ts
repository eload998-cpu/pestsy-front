import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenService } from 'src/app/services/token.service';
import { ErrorHandlingService } from 'src/app/services/error-handling.service';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RefreshTokenInterceptor implements HttpInterceptor {



    constructor(
        private errorHandlingService: ErrorHandlingService,
        private tokenService: TokenService,
        private _authService: AuthService,

    ) { }

    public intercept(req: HttpRequest<any>, next: HttpHandler) {

        return next.handle(req)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    if (error.status === 401) {
                        return this._authService.refreshToken().pipe(
                            switchMap(tokens => {

                                const clonedReq = req.clone({
                                    setHeaders: {
                                        Authorization: `Bearer ${tokens.token}`
                                    }
                                });

                                this.tokenService.setToken(tokens.token, tokens.refresh_token)
                                return next.handle(clonedReq);

                            }));

                        this._authService.logoutByTokenExpiration();


                    }
                    return throwError(error);
                })
            );
    }



}