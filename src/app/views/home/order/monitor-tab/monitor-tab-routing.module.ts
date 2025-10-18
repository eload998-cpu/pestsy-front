import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ShowResolverService } from 'src/app/services/solvers/administration/rodentControls/show-resolver.service';


const routes: Routes = [
  {
    path: '',
    component: TableComponent,
    data: { animation: 'monitor-tab/inicio' }

  },
  {
    path: 'nuevo',
    component: CreateComponent,
    data: { animation: 'monitor-tab/nuevo' }

  },
  {
    path: ':id/editar',
    component: EditComponent,
    data: { animation: 'monitor-tab/editar' },
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
export class MonitorTabRoutingModule { }
