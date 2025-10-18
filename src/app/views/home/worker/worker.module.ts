import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { WorkerRoutingModule } from './worker-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ShowComponent } from './show/show.component';


//SERVICES
import {WorkerService} from 'src/app/services/administration/worker.service';
import { ShowResolverService } from 'src/app/services/solvers/administration/workers/show-resolver.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PermissionGuard } from 'src/app/guards/permission.guard';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
    EditComponent,
    ShowComponent
  ],
  imports: [
    CommonModule,
    WorkerRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    WorkerService,
    ShowResolverService,
    PermissionGuard
  ]
})
export class WorkerModule { }