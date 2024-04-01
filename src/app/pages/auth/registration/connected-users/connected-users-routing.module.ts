import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnectedUsersComponent } from './connected-users.component';


const routes: Routes = [
    {
        path: '',
        component: ConnectedUsersComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class ConnectedUsersRegistrationRoutingModule { }
