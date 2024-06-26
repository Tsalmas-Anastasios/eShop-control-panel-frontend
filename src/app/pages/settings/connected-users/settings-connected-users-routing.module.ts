import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { UserDetailsComponent } from './user-details/user-details.component';


const routes: Routes = [
    {
        path: '',
        component: ListComponent
    },
    {
        path: ':user_id',
        component: UserDetailsComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class SettingsConnectedUsersRoutingModule { }
