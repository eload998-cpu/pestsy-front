import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from 'src/app/views/home/order/order.component'

//TABS
import { OrderTabComponent } from 'src/app/views/home/order/order-tab/order-tab.component';
import { ShowResolverService } from 'src/app/services/solvers/administration/orders/show-resolver.service';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { OrderTypeGuard } from 'src/app/guards/order-type.guard';



const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
    children: [
      {
        path: '',
        redirectTo: 'orden-tab',
        pathMatch: 'full',
      },
      {
        path: 'orden-tab',
        component: OrderTabComponent,
        data: { animation: 'orden-tab', permission: 'create_order' },
        runGuardsAndResolvers: 'always',
        canActivate: [PermissionGuard],
        resolve:
        {
          data: ShowResolverService

        }

      },
      {
        path: 'fumigacion-tab',
        loadChildren: () => import('src/app/views/home/order/fumigation-tab/fumigation-tab.module').then(m => m.FumigationTabModule),
        canActivate: [PermissionGuard, OrderTypeGuard],
        data: { animation: 'fumigacion-tab', permission: 'edit_order', orderType: ['General', 'Fumigación'], action: "create" }
      },
      {
        path: 'monitoreo-tab',
        loadChildren: () => import('src/app/views/home/order/monitor-tab/monitor-tab.module').then(m => m.MonitorTabModule),
        canActivate: [PermissionGuard, OrderTypeGuard],
        data: { animation: 'monitoreo-tab', permission: 'edit_order', orderType: ['General', 'Control de roedores'], action: "create" }

      },
      {
        path: 'xilofago-tab',
        loadChildren: () => import('src/app/views/home/order/xilofago-tab/xilofago-tab.module').then(m => m.XilofagoTabModule),
        canActivate: [PermissionGuard, OrderTypeGuard],
        data: { animation: 'xilofago-tab', permission: 'edit_order', orderType: ['General', 'Xilofago'], action: "create" }

      },
      {
        path: 'legionela-tab',
        loadChildren: () => import('src/app/views/home/order/legionella-tab/legionella-tab.module').then(m => m.LegionellaTabModule),
        canActivate: [PermissionGuard, OrderTypeGuard],
        data: { animation: 'legionella-tab', permission: 'edit_order', orderType: ['General', 'Legionela'], action: "create" }

      },
      {
        path: 'lampara-tab',
        loadChildren: () => import('src/app/views/home/order/lamp-tab/lamp-tab.module').then(m => m.LampTabModule),
        canActivate: [PermissionGuard, OrderTypeGuard],
        data: { animation: 'lampara-tab', permission: 'edit_order', orderType: ['General', 'Monitoreo de voladores (lámparas)'], action: "create" }
      },
      {
        path: 'trampa-tab',
        loadChildren: () => import('src/app/views/home/order/trap-tab/trap-tab.module').then(m => m.TrapTabModule),
        canActivate: [PermissionGuard, OrderTypeGuard],
        data: { animation: 'trampa-tab', permission: 'edit_order', orderType: ['General', 'Monitoreo de insectos'], action: "create" }
      },
      {
        path: 'imagen-tab',
        loadChildren: () => import('src/app/views/home/order/image-tab/image-tab.module').then(m => m.ImageTabModule),
        data: { animation: 'imagen-tab' }
      },
      {
        path: 'observacion-tab',
        loadChildren: () => import('src/app/views/home/order/observation-tab/observation-tab.module').then(m => m.ObservationTabModule),
        data: { animation: 'observacion-tab' }
      },
      {
        path: 'firma-tab',
        loadChildren: () => import('src/app/views/home/order/signature-tab/signature-tab.module').then(m => m.SignatureTabModule),
        data: { animation: 'firma-tab' }
      }
    ]
  },
  {
    path: '**',
    component: OrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class OrderRoutingModule { }
