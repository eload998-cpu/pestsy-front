import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { SubscriptionRoutingModule } from './subscription-routing.module';
import { ShowResolverService } from 'src/app/services/solvers/administration/orders/show-resolver.service';
import { SubscriptionComponent } from 'src/app/views/home/subscription/subscription.component'
import { SubscriptionService } from 'src/app/services/administration/subscription.service';
import { PaymentService } from 'src/app/services/resources/payment.service';
import { CreditCardComponent } from 'src/app/shared/components/paypal/buttons/credit-card.component';


import { PaymentComponent } from 'src/app/views/home/subscription/payment/payment.component';
import { NgxPayPalModule } from 'ngx-paypal';

//TABS


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    SubscriptionComponent,
    PaymentComponent,
    CreditCardComponent
  ],
  imports: [
    CommonModule,
    SubscriptionRoutingModule,
    FontAwesomeModule,
    SharedModule,
    NgxPayPalModule,

  ],
  providers: [
    ShowResolverService,
    SubscriptionService,
    PaymentService
  ]
})
export class SubscriptionModule { }