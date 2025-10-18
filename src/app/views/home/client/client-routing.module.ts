import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ShowComponent } from './show/show.component';
import { PermissionComponent } from './permission/permission.component';
import { ShowResolverService } from 'src/app/services/solvers/administration/clients/show-resolver.service';
import { PermissionGuard } from 'src/app/guards/permission.guard';


const routes: Routes = [
  {
    path: '',
    component: TableComponent,
    canActivate: [PermissionGuard],
    data: { animation: 'clientes/inicio', permission: 'list_client' }

  },
  {
    path: 'nuevo',
    component: CreateComponent,
    canActivate: [PermissionGuard],
    data: { animation: 'clientes/nuevo', permission: 'create_client' }

  },
  {
    path: ':id/editar',
    component: EditComponent,
    canActivate: [PermissionGuard],
    data: { animation: 'clientes/registro', permission: 'edit_client' },
    resolve:
    {
      model: ShowResolverService

    }
  },
  {
    path: ':id/ficheros-de-cliente',
    loadChildren: () => import('src/app/views/home/client/client-file/client-file.module').then(m => m.ClientFileModule),
    canActivate: [PermissionGuard],
    data: { animation: 'clientes/archivos', permission: 'add_file_client' },
    resolve:
    {
      model: ShowResolverService

    }
  },
  {
    path: ':id/detalles',
    component: ShowComponent,
    data: { animation: 'clientes/detalle' },
    resolve:
    {
      model: ShowResolverService

    }
  },

  /*

  STOPPED FOR NOW
  {
    path: ':id/permisos',
    component: PermissionComponent,
    data: { animation: 'clientes/permisos' },
    resolve: 
    {
      model: ShowResolverService

    }
  },*/
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
export class ClientRoutingModule { }
