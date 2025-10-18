import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from 'src/app/views/home/dashboard/dashboard.component'




const routes: Routes = [
  {
      path: '',
      component: DashboardComponent,
      children: [
         
      ]
  },
  {
      path: '**',
      component: DashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
  ]
})
export class DashboardRoutingModule { }
