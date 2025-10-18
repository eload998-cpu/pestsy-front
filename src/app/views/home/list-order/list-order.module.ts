import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { ListOrderRoutingModule } from './list-order-routing.module';
import { ShowResolverService } from 'src/app/services/solvers/administration/orders/show-resolver.service';

//TABS
import { CompleteTabComponent } from 'src/app/views/home/list-order/complete-tab/complete-tab.component';
import { PendingTabComponent } from 'src/app/views/home/list-order/pending-tab/pending-tab.component';
import { OrderService } from 'src/app/services/administration/order.service';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    CompleteTabComponent,
    PendingTabComponent
  ],
  imports: [
    CommonModule,
    ListOrderRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    ShowResolverService,
    OrderService
  ]
})
export class ListOrderModule { }