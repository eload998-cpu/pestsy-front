import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HeaderComponent } from 'src/app/views/layout/header/header.component';
import { SidebarComponent } from 'src/app/views/layout/sidebar/sidebar.component';
import { ProfileComponent } from 'src/app/views/layout/profile/profile.component';
import { MobileSidebarComponent } from 'src/app//views/layout/mobile-sidebar/mobile-sidebar.component';





import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { OrderComponent } from './order/order.component';
import { OrderComponent as EditOrderComponent } from './edit-order/order.component';
import { FileComponent } from './file/file.component';
import { HelpComponent } from 'src/app/shared/components/help/help.component';
import { ModalComponent } from 'src/app/shared/components/help/modal/modal.component';

import { EditShowResolverService } from 'src/app/services/solvers/administration/edit-orders/edit-show-resolver.service';

import { OrderService } from 'src/app/services/administration/order.service';

import { ListOrderComponent } from './list-order/list-order.component';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { PendingOrderGuard } from 'src/app/guards/pending-order.guard';
import { RenewPlanGuard } from 'src/app/guards/renew-plan.guard';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    SidebarComponent,
    ProfileComponent,
    MobileSidebarComponent,
    OrderComponent,
    EditOrderComponent,
    ListOrderComponent,
    FileComponent,
    HelpComponent,
    ModalComponent
    
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    EditShowResolverService,
    PermissionGuard,
    OrderService,
    PendingOrderGuard,
    RenewPlanGuard
  ]
})
export class HomeModule { }