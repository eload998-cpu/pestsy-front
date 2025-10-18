import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { ClientRoutingModule } from './client-routing.module';
import { TableComponent } from 'src/app/views/home/client/table/table.component';
import { CreateComponent } from 'src/app/views/home/client/create/create.component';
import { EditComponent } from 'src/app/views/home/client/edit/edit.component';
import { ShowComponent } from 'src/app/views/home/client/show/show.component';
import { PermissionComponent } from 'src/app/views/home/client/permission/permission.component';

import { PermissionGuard } from 'src/app/guards/permission.guard';


//SERVICES
import { ClientService } from 'src/app/services/administration/client.service';
import { ShowResolverService } from 'src/app/services/solvers/administration/clients/show-resolver.service';



import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
    EditComponent,
    ShowComponent,
    PermissionComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    ClientService,
    ShowResolverService,
    PermissionGuard
  ]
})
export class ClientModule { }