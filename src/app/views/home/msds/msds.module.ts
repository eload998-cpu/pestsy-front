import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { MsdsRoutingModule } from './msds-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MsdsService } from 'src/app/services/administration/msds.service';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
  ],
  imports: [
    CommonModule,
    MsdsRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    MsdsService
  ]
})
export class MsdsModule { }