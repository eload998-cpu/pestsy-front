import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { ShowResolverService } from 'src/app/services/solvers/administration/fumigation/show-resolver.service';


const routes: Routes = [
  {
    path: '',
    component: TableComponent,
    data: { animation: 'imagen-tab/inicio' }

  },
  {
    path: 'nuevo',
    component: CreateComponent,
    data: { animation: 'imagen-tab/nuevo' }

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
export class ImageTabRoutingModule { }
