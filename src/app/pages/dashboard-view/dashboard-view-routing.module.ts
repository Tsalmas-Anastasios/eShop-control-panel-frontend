import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardViewComponent } from './dashboard-view.component';
import { CashRegisterComponent } from '../cash-register/cash-register.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardViewComponent
  },
  {
    path: 'cash-register',
    component: CashRegisterComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardViewRoutingModule { }
