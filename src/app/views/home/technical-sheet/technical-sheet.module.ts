import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { TechnicalSheetRoutingModule } from './technical-sheet-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TechnicalSheetService } from 'src/app/services/administration/technical-sheet.service';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
  ],
  imports: [
    CommonModule,
    TechnicalSheetRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    TechnicalSheetService
  ]
})
export class TechnicalSheetModule { }