import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { CompleteTabRoutingModule } from './complete-tab-routing.module';
import { TableComponent } from './table/table.component';
import { EditComponent } from './edit/edit.component';
import { ShowResolverService } from 'src/app/services/solvers/administration/observation/show-resolver.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PermissionGuard } from 'src/app/guards/permission.guard';

@NgModule({
  declarations: [
    TableComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    CompleteTabRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    ShowResolverService,
    PermissionGuard
  ]
})
export class CompleteTabModule { }