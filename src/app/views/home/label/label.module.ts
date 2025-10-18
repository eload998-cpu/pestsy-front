import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { LabelRoutingModule } from './label-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LabelService } from 'src/app/services/administration/label.service';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
  ],
  imports: [
    CommonModule,
    LabelRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    LabelService
  ]
})
export class LabelModule { }