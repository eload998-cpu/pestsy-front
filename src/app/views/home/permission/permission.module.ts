import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { PermissionRoutingModule } from './permission-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PermissionService } from 'src/app/services/administration/permission.service';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
  ],
  imports: [
    CommonModule,
    PermissionRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    PermissionService
  ]
})
export class PermissionModule { }