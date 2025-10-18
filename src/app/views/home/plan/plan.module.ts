import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { PlanRoutingModule } from './plan-routing.module';
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
    PlanRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    ManagementPlanService
  ]
})
export class PlanModule { }