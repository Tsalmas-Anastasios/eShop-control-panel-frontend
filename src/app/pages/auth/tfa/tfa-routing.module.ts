import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiddlewareOptionsComponent } from './middleware-options/middleware-options.component';
import { AuthenticatorAppComponent } from './authenticator-app/authenticator-app.component';
import { EmailAuthenticationComponent } from './email-authentication/email-authentication.component';


const routes: Routes = [
    {
        path: '',
        component: MiddlewareOptionsComponent
    },
    {
        path: 'authenticator-app',
        component: AuthenticatorAppComponent
    },
    {
        path: 'email-authentication',
        component: EmailAuthenticationComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class TfaRoutingModule { }
