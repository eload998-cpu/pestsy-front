import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { FileRoutingModule } from './file-routing.module';
import { ShowResolverService } from 'src/app/services/solvers/administration/orders/show-resolver.service';

//TABS
import { PermissionTabComponent } from 'src/app/views/home/file/permission-tab/permission-tab.component';

import { OrderService } from 'src/app/services/administration/order.service';
import { PermissionService } from 'src/app/services/administration/permission.service';
import { TechnicalSheetService } from 'src/app/services/administration/technical-sheet.service';
import { LabelService } from 'src/app/services/administration/label.service';
import { MinSaludService } from 'src/app/services/administration/minsalud.service';
import { MsdsService } from 'src/app/services/administration/msds.service';
import { TechnicalStaffService } from 'src/app/services/administration/technical-staff.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    PermissionTabComponent,
  ],
  imports: [
    CommonModule,
    FileRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    ShowResolverService,
    OrderService,
    PermissionService,
    TechnicalSheetService,
    LabelService,
    MinSaludService,
    MsdsService,
    TechnicalStaffService
  ]
})
export class FileModule { }