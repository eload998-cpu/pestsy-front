import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ShowResolverService } from 'src/app/services/solvers/administration/observation/show-resolver.service';
import { PermissionGuard } from 'src/app/guards/permission.guard';


const routes: Routes = [
  {
    path: '',
    component: TableComponent,
    canActivate: [PermissionGuard],
    data: { animation: 'observacion-tab/inicio',permission: 'list_observation' }

  },
  {
    path: 'nuevo',
    component: CreateComponent,
    data: { animation: 'observacion-tab/nuevo',permission: 'create_observation' }

  },
  {
    path: ':id/editar',
    component: EditComponent,
    data: { animation: 'observacion-tab/editar',permission: 'edit_observation' },
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
export class ObservationTabRoutingModule { }
