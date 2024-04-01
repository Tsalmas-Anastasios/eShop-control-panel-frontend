import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderPapersComponent } from './order-papers/order-papers.component';


const routes: Routes = [
    {
        path: 'order-papers',
        component: OrderPapersComponent,
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PrintableDocumentsRoutingModule { }
