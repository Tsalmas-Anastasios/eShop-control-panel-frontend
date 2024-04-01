import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { NewCategoryComponent } from './new-category/new-category.component';


const routes: Routes = [
    {
        path: '',
        component: ListComponent
    },
    {
        path: 'new',
        component: NewCategoryComponent
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductsCategoriesRoutingModule { }
