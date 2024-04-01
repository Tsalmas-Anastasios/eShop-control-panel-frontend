import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasswordChangeCredentialsComponent } from './password-change-credentials/password-change-credentials.component';
import { ChangePasswordFormComponent } from './change-password-form/change-password-form.component';


const routes: Routes = [
    {
        path: '',
        component: PasswordChangeCredentialsComponent
    },
    {
        path: ':token',
        component: ChangePasswordFormComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class PasswordChangeRoutingModule { }
