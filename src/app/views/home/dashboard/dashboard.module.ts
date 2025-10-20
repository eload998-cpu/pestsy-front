import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { ShowResolverService } from 'src/app/services/solvers/administration/orders/show-resolver.service';
import { DashboardComponent } from 'src/app/views/home/dashboard/dashboard.component'
import { HighchartsChartComponent, provideHighcharts } from 'highcharts-angular';
import { DashboardService } from 'src/app/services/administration/dashboard.service';
import { SubscriptionService } from 'src/app/services/administration/subscription.service';
import { ReactiveFormsModule } from '@angular/forms';

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
    ReactiveFormsModule,
    HighchartsChartComponent
  ],
  providers: [
    ShowResolverService,
    DashboardService,
    SubscriptionService,
    provideHighcharts({
      instance: () => import('highcharts'),
      modules: () => [
        import('highcharts/esm/modules/export-data'),
        import('highcharts/esm/modules/exporting'),
        import('highcharts/esm/modules/offline-exporting'),
        import('highcharts/esm/modules/no-data-to-display')
      ]
    })
  ]
})
export class DashboardModule { }
