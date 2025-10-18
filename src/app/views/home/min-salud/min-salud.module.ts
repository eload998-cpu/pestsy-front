import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { MinSaludRoutingModule } from './min-salud-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MinSaludService } from 'src/app/services/administration/minsalud.service';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
  ],
  imports: [
    CommonModule,
    MinSaludRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    MinSaludService
  ]
})
export class MinSaludModule { }