import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CompanyEmailComponent } from './company-email/company-email.component';
import { IntegrationsHomeComponent } from './integrations-home/integrations-home.component';



const routes: Routes = [
    {
        path: '',
        component: IntegrationsHomeComponent
    },
    {
        path: 'company-emails',
        component: CompanyEmailComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class SettingsIntegrationsRoutingModule { }
