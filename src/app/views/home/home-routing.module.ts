import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { OrderComponent } from 'src/app/views/home/edit-order/order.component'
import { PermissionGuard } from 'src/app/guards/permission.guard';
import { EditShowResolverService } from 'src/app/services/solvers/administration/edit-orders/edit-show-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'clientes',
        pathMatch: 'full'
      },
      {
        path: 'suscripciones',
        loadChildren: () => import('src/app/views/home/subscription/subscription.module').then(m => m.SubscriptionModule),
        data: { animation: 'suscripcion' }

      },
      {
        path: 'tablero',
        loadChildren: () => import('src/app/views/home/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [PermissionGuard],
        data: { animation: 'tablero', permission: 'list_dashboard' }

      },
      {
        path: 'clientes',
        loadChildren: () => import('src/app/views/home/client/client.module').then(m => m.ClientModule),
        data: { animation: 'clientes' }

      },
      {
        path: 'obreros',
        loadChildren: () => import('src/app/views/home/worker/worker.module').then(m => m.WorkerModule),
        data: { animation: 'obreros' }

      },
      {
        path: 'ordenes',
        loadChildren: () => import('src/app/views/home/order/order.module').then(m => m.OrderModule),
        data: { animation: 'crear-ordenes' },


      },
      {
        path: 'editar-ordenes/:id',
        component: OrderComponent,
        loadChildren: () => import('src/app/views/home/edit-order/edit-order.module').then(m => m.EditOrderModule),
        data: { animation: 'editar-ordenes' },
        //runGuardsAndResolvers: 'always',
        resolve:
        {
          data: EditShowResolverService

        }

      },
      {
        path: 'listar-ordenes',
        loadChildren: () => import('src/app/views/home/list-order/list-order.module').then(m => m.ListOrderModule),
        data: { animation: 'listar-ordenes' }

      },
      {
        path: 'plagas',
        loadChildren: () => import('src/app/views/home/pest/pest.module').then(m => m.PestModule),
        data: { animation: 'plagas' }

      },
      {
        path: 'dispositivos',
        loadChildren: () => import('src/app/views/home/device/device.module').then(m => m.DeviceModule),
        data: { animation: 'dispositivos' }

      },
      {
        path: 'productos',
        loadChildren: () => import('src/app/views/home/product/product.module').then(m => m.ProductModule),
        data: { animation: 'productos' }

      },
      {
        path: 'ubicaciones',
        loadChildren: () => import('src/app/views/home/location/location.module').then(m => m.LocationModule),
        data: { animation: 'ubicaciones' }

      },
      {
        path: 'aplicaciones',
        loadChildren: () => import('src/app/views/home/aplication/aplication.module').then(m => m.AplicationModule),
        data: { animation: 'aplicaciones' }

      },
      {
        path: 'acciones-correctivas',
        loadChildren: () => import('src/app/views/home/corrective-action/corrective-action.module').then(m => m.CorrectiveActionModule),
        data: { animation: 'acciones correctivas' }

      },
      {
        path: 'desinfecciones',
        loadChildren: () => import('src/app/views/home/desinfection/desinfection.module').then(m => m.DesinfectionModule),
        data: { animation: 'desinfecciones' }

      },
      {
        path: 'elementos-afectados',
        loadChildren: () => import('src/app/views/home/affected-element/affected-element.module').then(m => m.AffectedElementModule),
        data: { animation: 'elementos' }

      },
      {
        path: 'tipo-de-construccion',
        loadChildren: () => import('src/app/views/home/construction-type/construction-type.module').then(m => m.ConstructionTypeModule),
        data: { animation: 'elementos' }

      },
      {
        path: 'archivos',
        canActivate: [PermissionGuard],
        loadChildren: () => import('src/app/views/home/file/file.module').then(m => m.FileModule),
        data: { animation: 'archivos', permission: 'list_file' }

      },
      {
        path: 'permiso',
        loadChildren: () => import('src/app/views/home/permission/permission.module').then(m => m.PermissionModule),
        canActivate: [PermissionGuard],
        data: { animation: 'permiso', permission: 'list_permission' }

      },
      {
        path: 'ficha-tecnica',
        loadChildren: () => import('src/app/views/home/technical-sheet/technical-sheet.module').then(m => m.TechnicalSheetModule),
        canActivate: [PermissionGuard],
        data: { animation: 'ficha-tecnica', permission: 'list_technical_sheet' }

      },
      {
        path: 'personal-tecnico',
        loadChildren: () => import('src/app/views/home/technical-staff/technical-staff.module').then(m => m.TechnicalStaffModule),
        canActivate: [PermissionGuard],
        data: { animation: 'personal-tecnico', permission: 'list_technical_staff' }

      },
      {
        path: 'min-salud',
        loadChildren: () => import('src/app/views/home/min-salud/min-salud.module').then(m => m.MinSaludModule),
        canActivate: [PermissionGuard],
        data: { animation: 'min-salud', permission: 'list_min_salud' }

      },
      {
        path: 'msds',
        loadChildren: () => import('src/app/views/home/msds/msds.module').then(m => m.MsdsModule),
        canActivate: [PermissionGuard],
        data: { animation: 'msds', permission: 'list_msds' }

      },
      {
        path: 'etiqueta',
        loadChildren: () => import('src/app/views/home/label/label.module').then(m => m.LabelModule),
        canActivate: [PermissionGuard],
        data: { animation: 'etiqueta', permission: 'list_label' }

      },
      {
        path: 'croquis',
        loadChildren: () => import('src/app/views/home/sketch/sketch.module').then(m => m.SketchModule),
        canActivate: [PermissionGuard],
        data: { animation: 'croquis', permission: 'list_sketch' }

      },
      {
        path: 'mip',
        loadChildren: () => import('src/app/views/home/mip/mip.module').then(m => m.MipModule),
        canActivate: [PermissionGuard],
        data: { animation: 'mip', permission: 'list_mip' }

      },
      {
        path: 'tendencias',
        loadChildren: () => import('src/app/views/home/trend/trend.module').then(m => m.TrendModule),
        canActivate: [PermissionGuard],
        data: { animation: 'tendencias', permission: 'list_trend' }

      },
      {
        path: 'informes',
        loadChildren: () => import('src/app/views/home/report/report.module').then(m => m.ReportModule),
        canActivate: [PermissionGuard],
        data: { animation: 'informes', permission: 'list_report' }

      },
      {
        path: 'planes',
        loadChildren: () => import('src/app/views/home/plan/plan.module').then(m => m.PlanModule),
        canActivate: [PermissionGuard],
        data: { animation: 'planes', permission: 'list_management_plan' }

      },
      {
        path: 'contacto',
        loadChildren: () => import('src/app/views/home/contact/contact.module').then(m => m.ContactModule),
        data: { animation: 'contacto' }

      },
      {
        path: 'configuraciones',
        loadChildren: () => import('src/app/views/home/configuration/configuration.module').then(m => m.ConfigurationModule),
        canActivate: [PermissionGuard],
        data: { animation: 'configuracion', permission: 'list_configuration' }

      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }