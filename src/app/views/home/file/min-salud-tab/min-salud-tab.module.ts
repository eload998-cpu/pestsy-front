import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { MinSaludTabRoutingModule } from './min-salud-tab-routing.module';
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
    MinSaludTabRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
  ]
})
export class MinSaludTabModule { }