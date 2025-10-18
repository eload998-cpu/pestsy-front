import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ShowResolverService } from 'src/app/services/solvers/administration/orders/show-resolver.service';
import { DashboardComponent } from 'src/app/views/home/dashboard/dashboard.component'
import { HighchartsChartModule } from 'highcharts-angular';
import { DashboardService } from 'src/app/services/administration/dashboard.service';
import { SubscriptionService } from 'src/app/services/administration/subscription.service';

//TABS


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FontAwesomeModule,
    SharedModule,
    HighchartsChartModule
  ],
  providers: [
    ShowResolverService,
    DashboardService,
    SubscriptionService
  ]
})
export class DashboardModule { }