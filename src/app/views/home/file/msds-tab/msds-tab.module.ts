import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { MsdsTabRoutingModule } from './msds-tab-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
  ],
  imports: [
    CommonModule,
    MsdsTabRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
  ]
})
export class MsdsTabModule { }