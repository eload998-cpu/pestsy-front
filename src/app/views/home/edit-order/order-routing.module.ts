import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from 'src/app/views/home/edit-order/order.component'

//TABS
import { OrderTabComponent } from 'src/app/views/home/edit-order/order-tab/order-tab.component';
import { ShowResolverService } from 'src/app/services/solvers/administration/edit-orders/show-resolver.service';
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { PendingOrderGuard } from 'src/app/guards/pending-order.guard';
import { OrderTypeGuard } from 'src/app/guards/order-type.guard';

const routes: Routes = [
  {
    path: '',
    component: OrderTabComponent,
    canActivate: [PermissionGuard, PendingOrderGuard],
    resolve: {
      data: ShowResolverService
    },
    data: { animation: 'orden-tab', permission: 'edit_order' },
    runGuardsAndResolvers: 'always'
  },
  {

    path: 'orden-tab',
    component: OrderTabComponent,
    canActivate: [PermissionGuard, PendingOrderGuard],
    data: { animation: 'orden-tab', permission: 'edit_order' },
    runGuardsAndResolvers: 'always',
    resolve:
    {
      data: ShowResolverService

    }

  },
  {
    path: 'fumigacion-tab',
    loadChildren: () => import('src/app/views/home/edit-order/fumigation-tab/fumigation-tab.module').then(m => m.FumigationTabModule),
    canActivate: [PermissionGuard, PendingOrderGuard, OrderTypeGuard],
    data: { animation: 'fumigacion-tab', permission: 'edit_order', orderType: ['General', 'Fumigación'], action: "edit" },
  },
  {
    path: 'xilofago-tab',
    loadChildren: () => import('src/app/views/home/edit-order/xilofago-tab/xilofago-tab.module').then(m => m.XilofagoTabModule),
    canActivate: [PermissionGuard, PendingOrderGuard, OrderTypeGuard],
    data: { animation: 'xilofago-tab', permission: 'edit_order', orderType: ['General', 'Xilofago'], action: "edit" }

  },
  {
    path: 'legionela-tab',
    loadChildren: () => import('src/app/views/home/edit-order/legionella-tab/legionella-tab.module').then(m => m.LegionellaTabModule),
    canActivate: [PermissionGuard, PendingOrderGuard, OrderTypeGuard],
    data: { animation: 'legionella-tab', permission: 'edit_order', orderType: ['General', 'Legionela'], action: "edit" }

  },
  {
    path: 'monitoreo-tab',
    loadChildren: () => import('src/app/views/home/edit-order/monitor-tab/monitor-tab.module').then(m => m.MonitorTabModule),
    canActivate: [PermissionGuard, PendingOrderGuard, OrderTypeGuard],
    data: { animation: 'monitoreo-tab', permission: 'edit_order', orderType: ['General', 'Control de roedores'], action: "edit" },

  },
  {
    path: 'lampara-tab',
    loadChildren: () => import('src/app/views/home/edit-order/lamp-tab/lamp-tab.module').then(m => m.LampTabModule),
    canActivate: [PermissionGuard, PendingOrderGuard, OrderTypeGuard],
    data: { animation: 'lampara-tab', permission: 'edit_order', orderType: ['General', 'Monitoreo de voladores (lámparas)'], action: "edit" },
  },
  {
    path: 'trampa-tab',
    loadChildren: () => import('src/app/views/home/edit-order/trap-tab/trap-tab.module').then(m => m.TrapTabModule),
    canActivate: [PermissionGuard, PendingOrderGuard, OrderTypeGuard],
    data: { animation: 'trampa-tab', permission: 'edit_order', orderType: ['General', 'Monitoreo de insectos'], action: "edit" },
  },
  {
    path: 'imagen-tab',
    loadChildren: () => import('src/app/views/home/edit-order/image-tab/image-tab.module').then(m => m.ImageTabModule),
    canActivate: [PermissionGuard, PendingOrderGuard],
    data: { animation: 'imagen-tab', permission: 'edit_order' },
  },
  {
    path: 'observacion-tab',
    loadChildren: () => import('src/app/views/home/edit-order/observation-tab/observation-tab.module').then(m => m.ObservationTabModule),
    canActivate: [PermissionGuard, PendingOrderGuard],
    data: { animation: 'observacion-tab', permission: 'edit_order' },
  },
  {
    path: 'firma-tab',
    loadChildren: () => import('src/app/views/home/edit-order/signature-tab/signature-tab.module').then(m => m.SignatureTabModule),
    canActivate: [PermissionGuard, PendingOrderGuard],
    data: { animation: 'firma-tab', permission: 'edit_order' },
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
