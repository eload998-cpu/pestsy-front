import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

import { ProductRoutingModule } from './product-routing.module';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ShowComponent } from './show/show.component';
import { ShowResolverService } from 'src/app/services/solvers/administration/products/show-resolver.service';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { GeneralModuleGuard } from 'src/app/guards/general-module.guard';

import { ProductService } from 'src/app/services/administration/product.service';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    TableComponent,
    CreateComponent,
    EditComponent,
    ShowComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    FontAwesomeModule,
    SharedModule
  ],
  providers: [
    ShowResolverService,
    PermissionGuard,
    ProductService,
    GeneralModuleGuard
  ]
})
export class ProductModule { }