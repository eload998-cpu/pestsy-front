import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { OrderRoutingModule } from './order-routing.module';
import { ShowResolverService } from 'src/app/services/solvers/administration/edit-orders/show-resolver.service';

//TABS
import { OrderTabComponent } from 'src/app/views/home/edit-order/order-tab/order-tab.component';
import { FumigationTabComponent } from 'src/app/views/home/edit-order/fumigation-tab/fumigation-tab.component';
import { LampTabComponent } from 'src/app/views/home/edit-order/lamp-tab/lamp-tab.component';
import { MonitorTabComponent } from 'src/app/views/home/edit-order/monitor-tab/monitor-tab.component';
import { ObservationTabComponent } from 'src/app/views/home/edit-order/observation-tab/observation-tab.component';
import { TrapTabComponent } from 'src/app/views/home/edit-order/trap-tab/trap-tab.component';
import { SignatureTabComponent } from 'src/app/views/home/edit-order/signature-tab/signature-tab.component';
import { ImageTabComponent } from 'src/app/views/home/edit-order/image-tab/image-tab.component';
import { LegionellaTabComponent } from 'src/app/views/home/edit-order/legionella-tab/legionella-tab.component';
import { XilofagoTabComponent } from 'src/app/views/home/edit-order/xilofago-tab/xilofago-tab.component';



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
import { OrderTypeGuard } from 'src/app/guards/order-type.guard';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    OrderTabComponent,
    FumigationTabComponent,
    LampTabComponent,
    MonitorTabComponent,
    ObservationTabComponent,
    TrapTabComponent,
    SignatureTabComponent,
    ImageTabComponent,
    LegionellaTabComponent,
    XilofagoTabComponent
    
  ],
  imports: [
    CommonModule,
    OrderRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    ShowResolverService,
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
export class EditOrderModule { }