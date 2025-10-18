import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { SketchRoutingModule } from './sketch-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SketchService } from 'src/app/services/administration/sketch.service';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
  ],
  imports: [
    CommonModule,
    SketchRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    SketchService
  ]
})
export class SketchModule { }