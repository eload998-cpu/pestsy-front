import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { PestRoutingModule } from './pest-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ShowComponent } from './show/show.component';



import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShowResolverService } from 'src/app/services/solvers/administration/pests/show-resolver.service';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { PestService } from 'src/app/services/administration/pest.service';
import { GeneralModuleGuard } from 'src/app/guards/general-module.guard';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
    EditComponent,
    ShowComponent
  ],
  imports: [
    CommonModule,
    PestRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    ShowResolverService,
    PermissionGuard,
    PestService,
    GeneralModuleGuard
  ]
})
export class PestModule { }