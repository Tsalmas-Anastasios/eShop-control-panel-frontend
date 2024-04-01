import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { CompanyDataComponent } from './company-data/company-data.component';


const routes: Routes = [
    {
        path: '',
        component: ProfileComponent
    },
    {
        path: 'company',
        component: CompanyDataComponent
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }
