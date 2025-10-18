import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { PlanTabRoutingModule } from './plan-tab-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ManagementPlanService } from 'src/app/services/administration/management-plan.service';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
  ],
  imports: [
    CommonModule,
    PlanTabRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    ManagementPlanService
  ]
})
export class PlanTabModule { }