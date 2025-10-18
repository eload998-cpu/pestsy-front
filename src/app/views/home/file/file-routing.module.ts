import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FileComponent } from 'src/app/views/home/file/file.component'

//TABS
import { ShowResolverService } from 'src/app/services/solvers/administration/orders/show-resolver.service';



const routes: Routes = [
  {
    path: '',
    component: FileComponent,
    children: [
      {
        path: '',
        redirectTo: 'permisos-tab',
        pathMatch: 'full',
      },
      {
        path: 'permisos-tab',
        loadChildren: () => import('src/app/views/home/file/permission-tab/permission-tab.module').then(m => m.PermissionTabModule),
        data: { animation: 'completadas-tab' }
      },
      {
        path: 'fichas-tecnicas-tab',
        loadChildren: () => import('src/app/views/home/file/technical-sheet-tab/technical-sheet-tab.module').then(m => m.TechnicalSheetTabModule),
        data: { animation: 'fichas-tecnicas-tab' }
      },
      {
        path: 'personal-tecnico-tab',
        loadChildren: () => import('src/app/views/home/file/technical-staff-tab/technical-staff-tab.module').then(m => m.TechnicalStaffTabModule),
        data: { animation: 'personal-tecnico-tab' }
      },
      {
        path: 'msds-tab',
        loadChildren: () => import('src/app/views/home/file/msds-tab/msds-tab.module').then(m => m.MsdsTabModule),
        data: { animation: 'msds-tab' }
      },
      {
        path: 'min-salud-tab',
        loadChildren: () => import('src/app/views/home/file/min-salud-tab/min-salud-tab.module').then(m => m.MinSaludTabModule),
        data: { animation: 'msds-tab' }
      },
      {
        path: 'etiqueta-tab',
        loadChildren: () => import('src/app/views/home/file/label-tab/label-tab.module').then(m => m.LabelTabModule),
        data: { animation: 'etiqueta-tab' }
      }


    ]
  },
  {
    path: '**',
    component: FileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class FileRoutingModule { }
