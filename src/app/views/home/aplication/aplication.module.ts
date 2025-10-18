import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { AplicationRoutingModule } from './aplication-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ShowComponent } from './show/show.component';
import { ShowResolverService } from 'src/app/services/solvers/administration/aplications/show-resolver.service';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { GeneralModuleGuard } from 'src/app/guards/general-module.guard';

import { AplicationService } from 'src/app/services/administration/aplication.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
    EditComponent,
    ShowComponent
  ],
  imports: [
    CommonModule,
    AplicationRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    ShowResolverService,
    PermissionGuard,
    AplicationService,
    GeneralModuleGuard
  ]
})
export class AplicationModule { }