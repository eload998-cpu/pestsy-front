import { APP_INITIALIZER, LOCALE_ID, NgModule, CUSTOM_ELEMENTS_SCHEMA, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from 'src/app/interceptors/auth.interceptor';
import { RefreshTokenInterceptor } from 'src/app/interceptors/refresh-token.interceptor';

import { SharedModule } from 'src/app/shared/shared.module';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { ToastrModule } from 'ngx-toastr';
import { JwtModule } from "@auth0/angular-jwt";



import { LoginComponent } from './views/login/login.component';
import { PreLoginComponent } from './views/pre-login/pre-login.component';
import { RegistrationComponent } from './views/registration/registration.component';
import { PasswordRecoveryComponent } from './views/password-recovery/password-recovery.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { PreviewOrderComponent } from './views/preview-order/preview-order.component';
import { InternalErrorComponent } from 'src/app/views/errors/internal-error/internal-error.component';
import { NotFoundComponent } from 'src/app/views/errors/not-found/not-found.component';


//SERVICES
import { LocationCountriesService } from 'src/app/services/resources/location-countries.service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { PermissionService } from 'src/app/services/permission.service';
import { BaseComponent } from './views/base/base.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { GlobalErrorHandler } from './services/global-error-handler.service';
import { ErrorHandler } from '@angular/core';
import { environment } from 'src/environments/environment';
export function tokenGetter() {
  return localStorage.getItem("auth_token");
}
defineCustomElements(window);


function checkIfASessionExists(
  tokenService: TokenService,
  authenticationService: AuthService
): () => Promise<void> {
  return () => new Promise<void>(async resolve => {

    try {
      const token = localStorage.getItem('auth_token');
      const refresh_token = localStorage.getItem('refresh_token');

      if (token) {
        tokenService.setToken(token, refresh_token);
        await authenticationService.getAuthUser();
      }
    }
    finally {
      resolve();
    }
  })
}


@NgModule({ declarations: [
        AppComponent,
        LoginComponent,
        PreLoginComponent,
        RegistrationComponent,
        InternalErrorComponent,
        NotFoundComponent,
        PasswordRecoveryComponent,
        ChangePasswordComponent,
        PreviewOrderComponent,
        BaseComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        BsDropdownModule.forRoot(),
        FontAwesomeModule,
        NgxSpinnerModule,
        ToastrModule.forRoot(),
        CKEditorModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: tokenGetter,
                allowedDomains: [],
                disallowedRoutes: [],
            },
        }),
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: environment.production,
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        })], providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: checkIfASessionExists,
            deps: [TokenService, AuthService],
            multi: true,
        },
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        LocationCountriesService,
        AuthService,
        TokenService,
        PermissionService,
        { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class AppModule { }
