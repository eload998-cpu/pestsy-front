import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ShowComponent } from './show/show.component';
import { ShowResolverService } from 'src/app/services/solvers/administration/products/show-resolver.service';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { GeneralModuleGuard } from 'src/app/guards/general-module.guard';


const routes: Routes = [
  {
    path: '',
    component: TableComponent,
    canActivate: [PermissionGuard],
    data: { animation: 'productos/inicio', permission: 'list_product' }

  },
  {
    path: 'nuevo',
    component: CreateComponent,
    canActivate: [PermissionGuard],
    data: { animation: 'productos/nuevo', permission: 'create_product' }

  },
  {
    path: ':id/editar',
    component: EditComponent,
    canActivate: [PermissionGuard, GeneralModuleGuard],
    data: { animation: 'productos/registro', permission: 'edit_product', module: 'product' },
    resolve:
    {
      model: ShowResolverService

    }
  },
  {
    path: ':id/detalles',
    component: ShowComponent,
    data: { animation: 'productos/detalle' },
    resolve:
    {
      model: ShowResolverService

    }
  },
  {
    path: '**',
    component: TableComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class ProductRoutingModule { }
