import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegrationsHomeComponent } from './integrations-home.component';
import { SettingsIntegrationsRoutingModule } from '../settings-integrations--routing.module';



@NgModule({
  declarations: [
    IntegrationsHomeComponent
  ],
  imports: [
    CommonModule,
    SettingsIntegrationsRoutingModule
  ],
  exports: [
    IntegrationsHomeComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IntegrationsHomeModule { }
