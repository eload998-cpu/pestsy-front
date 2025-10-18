import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { TechnicalStaffRoutingModule } from './technical-staff-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TechnicalStaffService } from 'src/app/services/administration/technical-staff.service';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
  ],
  imports: [
    CommonModule,
    TechnicalStaffRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    TechnicalStaffService
  ]
})
export class TechnicalStaffModule { }