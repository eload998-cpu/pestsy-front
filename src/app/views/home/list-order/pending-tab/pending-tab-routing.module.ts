import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { EditComponent } from './edit/edit.component';
import { ShowResolverService } from 'src/app/services/solvers/administration/orders/show-resolver.service';
import { PermissionGuard } from 'src/app/guards/permission.guard';


const routes: Routes = [
  {
    path: '',
    component: TableComponent,
    canActivate: [PermissionGuard],
    data: { animation: 'pendientes-tab/inicio',permission: 'list_order' }

  },
  {
    path: ':id/editar',
    component: EditComponent,
    data: { animation: 'pendientes-tab/editar',permission: 'edit_order' },
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
export class PendingTabRoutingModule { }
