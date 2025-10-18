import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { ReportRoutingModule } from './report-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReportService } from 'src/app/services/administration/report.service';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    ReportService
  ]
})
export class ReportModule { }