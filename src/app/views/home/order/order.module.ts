import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { OrderRoutingModule } from './order-routing.module';
import { ShowResolverService } from 'src/app/services/solvers/administration/orders/show-resolver.service';

//TABS
import { OrderTabComponent } from 'src/app/views/home/order/order-tab/order-tab.component';
import { FumigationTabComponent } from 'src/app/views/home/order/fumigation-tab/fumigation-tab.component';
import { LampTabComponent } from 'src/app/views/home/order/lamp-tab/lamp-tab.component';
import { MonitorTabComponent } from 'src/app/views/home/order/monitor-tab/monitor-tab.component';
import { ObservationTabComponent } from 'src/app/views/home/order/observation-tab/observation-tab.component';
import { TrapTabComponent } from 'src/app/views/home/order/trap-tab/trap-tab.component';
import { SignatureTabComponent } from 'src/app/views/home/order/signature-tab/signature-tab.component';
import { ImageTabComponent } from 'src/app/views/home/order/image-tab/image-tab.component';
import { PermissionGuard } from 'src/app/guards/permission.guard';

import { OrderService } from 'src/app/services/administration/order.service';
import { FumigationService } from 'src/app/services/administration/fumigation.service';
import { LampService } from 'src/app/services/administration/lamp.service';
import { ObservationService } from 'src/app/services/administration/observation.service';
import { TrapService } from 'src/app/services/administration/trap.service';
import { SignatureService } from 'src/app/services/administration/signature.service';
import { ImageService } from 'src/app/services/administration/image.service';
import { RodentControlService } from 'src/app/services/administration/rodent-control.service';
import { XylophageControlService } from 'src/app/services/administration/xylophage-control.service';
import { LegionellaControlService } from 'src/app/services/administration/legionella-control.service';



import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrderTypeGuard } from 'src/app/guards/order-type.guard';

@NgModule({
  declarations: [
    OrderTabComponent,
    FumigationTabComponent,
    LampTabComponent,
    MonitorTabComponent,
    ObservationTabComponent,
    TrapTabComponent,
    SignatureTabComponent,
    ImageTabComponent
    
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    ShowResolverService,
    PermissionGuard,
    OrderService,
    FumigationService,
    LampService,
    ObservationService,
    TrapService,
    SignatureService,
    ImageService,
    RodentControlService,
    XylophageControlService,
    LegionellaControlService,
    OrderTypeGuard
  ]
})
export class OrderModule { }