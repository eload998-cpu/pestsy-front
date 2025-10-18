import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { LocationRoutingModule } from './location-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ShowComponent } from './show/show.component';
import { ShowResolverService } from 'src/app/services/solvers/administration/locations/show-resolver.service';
import { PermissionGuard } from 'src/app/guards/permission.guard';

import { LocationService } from 'src/app/services/administration/location.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
    LocationRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    ShowResolverService,
    PermissionGuard,
    LocationService,
    GeneralModuleGuard
  ]
})
export class LocationModule { }