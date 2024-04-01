import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar.component';
import { NbMenuModule } from '@nebular/theme';

import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    CommonModule,
    NbMenuModule,
    TranslateModule
  ],
  exports: [
    SidebarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SidebarModule { }
