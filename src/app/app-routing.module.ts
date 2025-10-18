import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';


import { LoginComponent } from './views/login/login.component';
import { PreLoginComponent } from './views/pre-login/pre-login.component';

import { RegistrationComponent } from './views/registration/registration.component';
import { PasswordRecoveryComponent } from './views/password-recovery/password-recovery.component';
import { ChangePasswordComponent } from './views/change-password/change-password.component';
import { PreviewOrderComponent } from './views/preview-order/preview-order.component';


// GUARDS
import { BeforeLoginGuard } from 'src/app/guards/before-login.guard';
import { ChangePasswordGuard } from 'src/app/guards/change-password.guard';

import { AfterLoginGuard } from 'src/app/guards/after-login.guard';
import { VerifyTokenGuard } from 'src/app/guards/verify-token.guard';
import { UserHasSomeAdminRoleGuard } from 'src/app/guards/user-has-some-admin-role.guard';

// ERROR PAGES
import { InternalErrorComponent } from 'src/app/views/errors/internal-error/internal-error.component';
import { NotFoundComponent } from 'src/app/views/errors/not-found/not-found.component';
import { SuccessfulPaymentComponent } from 'src/app/views/responses/successful/successful-payment.component';
import { UnSuccessfulPaymentComponent } from 'src/app/views/responses/cancelled/unsuccessful-payment.component';


const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'pre-login',
    component: PreLoginComponent,
    data: { animation: 'pre-login' },
    canActivate: [BeforeLoginGuard]


  },
  {
    path: 'login',
    component: LoginComponent,
    data: { animation: 'login' },
    canActivate: [BeforeLoginGuard]


  },
  {
    path: 'registro',
    component: RegistrationComponent,
    data: { animation: 'registro' },
    canActivate: [BeforeLoginGuard]

  },
  {
    path: 'recuperar-contrasena',
    component: PasswordRecoveryComponent,
    data: { animation: 'recuperar_contrasena' },
    canActivate: [BeforeLoginGuard]

  },
  {
    path: 'cambiar-contrasena/:token',
    component: ChangePasswordComponent,
    data: { animation: 'cambiar_contrasena' },
    canActivate: [BeforeLoginGuard, ChangePasswordGuard]

  },
  {
    path: 'transaccion-exitosa',
    component: SuccessfulPaymentComponent,
    canActivate: [AfterLoginGuard],
    data: { animation: 'login' }
  },
  {
    path: 'transaccion-no-completada',
    component: UnSuccessfulPaymentComponent,
    canActivate: [AfterLoginGuard],
    data: { animation: 'login' }
  },
  {
    path: 'home',
    data: { animation: 'home' },
    loadChildren: () => import('src/app/views/home/home.module').then(m => m.HomeModule),
    canActivate: [AfterLoginGuard]

  },
  {
    path: 'preview-order',
    component: PreviewOrderComponent,
    data: { animation: 'preview-order' }

  },
  { path: '500', component: InternalErrorComponent },
  { path: '404', component: NotFoundComponent },

  //Wild Card Route for 404 request
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '404'
  },

];

export const routingConfiguration: ExtraOptions = {
  paramsInheritanceStrategy: 'always',
  onSameUrlNavigation: 'reload'
};

@NgModule({
  imports: [RouterModule.forRoot(routes, routingConfiguration)],
  exports: [RouterModule],
  providers: [
    BeforeLoginGuard,
    AfterLoginGuard,
    VerifyTokenGuard,
    ChangePasswordGuard
  ]
})
export class AppRoutingModule { }
