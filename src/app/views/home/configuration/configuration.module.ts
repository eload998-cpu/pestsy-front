import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { TableComponent } from './table/table.component';
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { CancelSubscriptionComponent } from './cancel-subscription/cancel-subscription.component';
import { RecurringPaymentComponent } from './recurring-payments/recurring-payment.component';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { SubscriptionGuard } from 'src/app/guards/subscription.guard';
import { SubscriptionActivationGuard } from 'src/app/guards/subscription-activation.guard';

import { ConfigurationService } from 'src/app/services/administration/configuration.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    TableComponent,
    DeleteAccountComponent,
    CancelSubscriptionComponent,
    RecurringPaymentComponent
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    PermissionGuard,
    SubscriptionGuard,
    ConfigurationService,
    SubscriptionActivationGuard
  ]
})
export class ConfigurationModule { }