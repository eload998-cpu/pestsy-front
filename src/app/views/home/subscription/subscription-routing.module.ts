import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubscriptionComponent } from 'src/app/views/home/subscription/subscription.component'
import { PaymentComponent } from 'src/app/views/home/subscription/payment/payment.component';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { RenewPlanGuard } from 'src/app/guards/renew-plan.guard';

const routes: Routes = [
  {
    path: '',
    component: SubscriptionComponent,
    data: { animation: 'subscription', permission: 'pay_subscription' },
    canActivate: [PermissionGuard,RenewPlanGuard]

  },
  {
    path: 'pago/:plan_id',
    component: PaymentComponent,
    data: { animation: 'pago/:plan_id', permission: 'pay_subscription' },
    canActivate: [PermissionGuard,RenewPlanGuard]

  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class SubscriptionRoutingModule { }
