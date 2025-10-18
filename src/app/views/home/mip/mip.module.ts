import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { MipRoutingModule } from './mip-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MipService } from 'src/app/services/administration/mip.service';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
  ],
  imports: [
    CommonModule,
    MipRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    MipService
  ]
})
export class MipModule { }