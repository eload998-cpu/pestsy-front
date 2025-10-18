import { ErrorHandler, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthUserService } from 'src/app/services/auth-user.service';
import { take } from 'rxjs/operators';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    private resources_url: string;

    constructor(
        protected httpClient: HttpClient,
        private _authUserService: AuthUserService,

    ) {

        this.resources_url = environment.administrationApiUrl;

    }

    handleError(error: any): void {


        try {
            /*
            this._authUserService.userObservable.pipe(take(1)).subscribe(
                (authUser: any) => {

                    const errorDetails = this.getErrorDetails(error, authUser);

                    this.httpClient.post<any>(`${this.resources_url}/logs`, { errorDetails }).subscribe({
                        next: (res) => console.log('Logged error successfully', res),
                        error: (err) => console.error('Failed to log error', err)
                    });
                }
            );*/


        }
        catch (error) {
            console.error(error);

        }
        console.error('An error occurred:', error);
    }


    private getErrorDetails(error: any, user: any) {
        return {
            message: error?.message || error.toString(),
            stack: error?.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            user: user
        };
    }
}