import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';


const routes: Routes = [
  {
    path: '',
    component: TableComponent,
    data: { animation: 'mip/inicio' }

  },
  {
    path: 'nuevo',
    component: CreateComponent,
    data: { animation: 'mip/nuevo' }

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
export class MipRoutingModule { }
