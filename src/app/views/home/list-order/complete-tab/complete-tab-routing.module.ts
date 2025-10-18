import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { EditComponent } from './edit/edit.component';
import { ShowResolverService } from 'src/app/services/solvers/administration/observation/show-resolver.service';
import { PermissionGuard } from 'src/app/guards/permission.guard';

const routes: Routes = [
  {
    path: '',
    component: TableComponent,
    data: { animation: 'completadas-tab/inicio',permission: 'list_order' },
    canActivate: [PermissionGuard],

  },
  {
    path: ':id/editar',
    component: EditComponent,
    data: { animation: 'completadas-tab/editar',permission: 'edit_order'  },
    canActivate: [PermissionGuard],
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
export class CompleteTabRoutingModule { }
