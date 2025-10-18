import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOrderComponent } from 'src/app/views/home/list-order/list-order.component'

//TABS
import { ShowResolverService } from 'src/app/services/solvers/administration/orders/show-resolver.service';
import { PermissionGuard } from 'src/app/guards/permission.guard';



const routes: Routes = [
  {
      path: '',
      component: ListOrderComponent,
      children: [
          {
              path: '',
              redirectTo: 'completadas-tab',
              pathMatch: 'full',
          },
          {
            path: 'completadas-tab',
            loadChildren: () => import('src/app/views/home/list-order/complete-tab/complete-tab.module').then(m => m.CompleteTabModule),
            data: { animation: 'completadas-tab' }
          },
          {
            path: 'pendientes-tab',
            loadChildren: () => import('src/app/views/home/list-order/pending-tab/pending-tab.module').then(m => m.PendingTabModule),
            data: { animation: 'pendientes-tab' }
    
          }
        
      ]
  },
  {
      path: '**',
      component: ListOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class ListOrderRoutingModule { }
