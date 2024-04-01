import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { WarehousePageComponent } from './warehouse-page/warehouse-page.component';


const routes: Routes = [
    {
        path: '',
        component: ListComponent
    },
    {
        path: ':warehouse_id',
        component: WarehousePageComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class WarehousesSettingsRoutingModule { }
