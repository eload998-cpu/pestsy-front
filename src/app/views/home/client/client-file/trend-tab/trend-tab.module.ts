import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { TrendTabRoutingModule } from './trend-tab-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TrendService } from 'src/app/services/administration/trend.service';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
  ],
  imports: [
    CommonModule,
    TrendTabRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    TrendService
  ]
})
export class TrendTabModule { }