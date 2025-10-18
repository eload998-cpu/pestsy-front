import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { CancelSubscriptionComponent } from './cancel-subscription/cancel-subscription.component';
import { RecurringPaymentComponent } from './recurring-payments/recurring-payment.component';

import { PermissionGuard } from 'src/app/guards/permission.guard';
import { SubscriptionGuard } from 'src/app/guards/subscription.guard';
import { SubscriptionActivationGuard } from 'src/app/guards/subscription-activation.guard';


const routes: Routes = [
  {
    path: '',
    component: TableComponent,
    canActivate: [PermissionGuard],
    data: { animation: 'configuraciones/inicio',permission: 'list_aplication'  }

  },
  {
    path: 'eliminar-cuenta',
    component: DeleteAccountComponent,
    canActivate: [PermissionGuard],
    data: { animation: 'configuraciones/eliminar-cuenta',permission: 'list_aplication'  }

  },
  {
    path: 'cancelar-suscripcion',
    component: CancelSubscriptionComponent,
    canActivate: [SubscriptionGuard],
    data: { animation: 'configuraciones/cancelar-suscripcion',permission: 'list_aplication'  }

  },
  {
    path: '**',
    component: TableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class ConfigurationRoutingModule { }
