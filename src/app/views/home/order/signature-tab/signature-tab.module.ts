import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { SignatureTabRoutingModule } from './signature-tab-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { PermissionGuard } from 'src/app/guards/permission.guard';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
  ],
  imports: [
    CommonModule,
    SignatureTabRoutingModule,
    FontAwesomeModule,
    SharedModule,
    AngularSignaturePadModule 
  ],
  providers: [
    PermissionGuard
  ]
})
export class SignatureTabModule { }