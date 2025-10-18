import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ShowComponent } from './show/show.component';
import { ShowResolverService } from 'src/app/services/solvers/administration/construction-type/show-resolver.service';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { GeneralModuleGuard } from 'src/app/guards/general-module.guard';


const routes: Routes = [
  {
    path: '',
    component: TableComponent,
    canActivate: [PermissionGuard],
    data: { animation: 'tipo-de-construccion/inicio', permission: 'list_aplication' }

  },
  {
    path: 'nuevo',
    component: CreateComponent,
    canActivate: [PermissionGuard],
    data: { animation: 'tipo-de-construccion/nuevo', permission: 'create_aplication' }

  },
  {
    path: ':id/editar',
    component: EditComponent,
    canActivate: [PermissionGuard, GeneralModuleGuard],
    data: { animation: 'tipo-de-construccion/registro', permission: 'edit_aplication', module: 'construction_type' },
    resolve:
    {
      model: ShowResolverService

    }
  },
  {
    path: ':id/detalles',
    component: ShowComponent,
    data: { animation: 'tipo-de-construccion/detalle' },
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
export class ConstructionTypeRoutingModule { }
