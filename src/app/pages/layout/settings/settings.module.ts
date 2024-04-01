import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { NbLayoutModule, NbSearchModule, NbActionsModule, NbSidebarModule } from '@nebular/theme';

import { SettingsComponent } from './settings.component';
import { NavbarModule } from '../dashboard/components/navbar/navbar.module';
import { FooterModule } from '../dashboard/components/footer/footer.module';
import { SidebarModule } from './components/sidebar/sidebar.module';


@NgModule({
  declarations: [
    SettingsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxSpinnerModule,
    TranslateModule,
    NbLayoutModule,
    NbSearchModule,
    NbActionsModule,
    NbSidebarModule,
    FooterModule,
    NavbarModule,
    SidebarModule,
  ],
  exports: [
    SettingsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingsModule { }
