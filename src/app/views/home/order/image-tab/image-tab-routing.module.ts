import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './table/table.component';
import { CreateComponent } from './create/create.component';
import { ShowResolverService } from 'src/app/services/solvers/administration/fumigation/show-resolver.service';
import { PermissionGuard } from 'src/app/guards/permission.guard';


const routes: Routes = [
  {
    path: '',
    component: TableComponent,
    canActivate: [PermissionGuard],
    data: { animation: 'imagen-tab/inicio',permission: 'list_image' }

  },
  {
    path: 'nuevo',
    component: CreateComponent,
    canActivate: [PermissionGuard],

    data: { animation: 'imagen-tab/nuevo',permission: 'create_image'  }

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
