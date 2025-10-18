import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { TrapTabRoutingModule } from './trap-tab-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShowResolverService } from 'src/app/services/solvers/administration/trap/show-resolver.service';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { OrderTypeGuard } from 'src/app/guards/order-type.guard';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
    EditComponent,

  ],
  imports: [
    CommonModule,
    TrapTabRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    ShowResolverService,
    PermissionGuard,
    OrderTypeGuard
  ]
})
export class TrapTabModule { }