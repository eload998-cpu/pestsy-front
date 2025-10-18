import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientFileComponent } from 'src/app/views/home/client/client-file/client-file.component'

//TABS
import { ShowResolverService } from 'src/app/services/solvers/administration/orders/show-resolver.service';



const routes: Routes = [
  {
      path: '',
      component: ClientFileComponent,
      children: [
          {
              path: '',
              redirectTo: 'croquis-tab',
              pathMatch: 'full',
          },
          {
            path: 'croquis-tab',
            loadChildren: () => import('src/app/views/home/client/client-file/sketch-tab/sketch-tab.module').then(m => m.SketchTabModule),
            data: { animation: 'croquis-tab' }
          },
          {
            path: 'mip-tab',
            loadChildren: () => import('src/app/views/home/client/client-file/mip-tab/mip-tab.module').then(m => m.MipTabModule),
            data: { animation: 'mip-tab' }
          },
          {
            path: 'informes-tab',
            loadChildren: () => import('src/app/views/home/client/client-file/report-tab/report-tab.module').then(m => m.ReportTabModule),
            data: { animation: 'informes-tab' }
          },
          {
            path: 'tendencias-tab',
            loadChildren: () => import('src/app/views/home/client/client-file/trend-tab/trend-tab.module').then(m => m.TrendTabModule),
            data: { animation: 'tendencias-tab' }
          },
          {
            path: 'planes-tab',
            loadChildren: () => import('src/app/views/home/client/client-file/plan-tab/plan-tab.module').then(m => m.PlanTabModule),
            data: { animation: 'planes-tab' }
          }
         
         
        
      ]
  },
  {
      path: '**',
      component: ClientFileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class ClientFileRoutingModule { }
