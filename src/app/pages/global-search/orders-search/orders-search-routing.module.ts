import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersSearchComponent } from './orders-search.component';



const routes: Routes = [
  {
    path: '',
    component: OrdersSearchComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersSearchRoutingModule { }
