import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ShowComponent } from './show/show.component';
import { ShowResolverService } from 'src/app/services/solvers/administration/workers/show-resolver.service';
import { PermissionGuard } from 'src/app/guards/permission.guard';


const routes: Routes = [
  {
    path: '',
    component: TableComponent,
    canActivate: [PermissionGuard],
    data: { animation: 'obreros/inicio',permission: 'list_worker' }

  },
  {
    path: 'nuevo',
    component: CreateComponent,
    canActivate: [PermissionGuard],
    data: { animation: 'obreros/nuevo',permission: 'list_worker' }

  },
  {
    path: ':id/editar',
    component: EditComponent,
    canActivate: [PermissionGuard],
    data: { animation: 'obreros/editar',permission: 'edit_worker' },
    resolve: 
    {
      model: ShowResolverService

    }
  },
  {
    path: ':id/detalles',
    component: ShowComponent,
    data: { animation: 'obreros/detalle' },
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
export class WorkerRoutingModule { }
