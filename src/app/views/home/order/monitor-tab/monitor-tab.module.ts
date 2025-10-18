import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { MonitorTabRoutingModule } from './monitor-tab-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';



import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShowResolverService } from 'src/app/services/solvers/administration/rodentControls/show-resolver.service';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
    EditComponent
  ],
  imports: [
    CommonModule,
    MonitorTabRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    ShowResolverService,
  ]
})
export class MonitorTabModule { }