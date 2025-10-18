import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { ClientFileRoutingModule } from './client-file-routing.module';
import { ClientFileComponent } from 'src/app/views/home/client/client-file/client-file.component';

import { ShowResolverService } from 'src/app/services/solvers/administration/orders/show-resolver.service';
import { OrderService } from 'src/app/services/administration/order.service';

//TABS

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    ClientFileComponent
  ],
  imports: [
    CommonModule,
    ClientFileRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    ShowResolverService,
    OrderService
  ]
})
export class ClientFileModule { }