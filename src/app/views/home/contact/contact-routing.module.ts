import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { PermissionGuard } from 'src/app/guards/permission.guard';


const routes: Routes = [
  {
    path: '',
    component: CreateComponent,
    canActivate: [PermissionGuard],
    data: { animation: 'contacto/nuevo',permission: 'create_aplication'  }

  },
  {
    path: 'nuevo',
    component: CreateComponent,
    canActivate: [PermissionGuard],
    data: { animation: 'contacto/nuevo',permission: 'create_aplication'  }

  },
  {
    path: '**',
    component: CreateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class ContactRoutingModule { }
