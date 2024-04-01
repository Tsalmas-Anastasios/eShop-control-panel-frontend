import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusDropdownCustomModuleComponent } from './status-dropdown-custom-module.component';
import { LaddaModule } from 'angular2-ladda';



@NgModule({
  declarations: [
    StatusDropdownCustomModuleComponent
  ],
  imports: [
    CommonModule,
    LaddaModule
  ],
  exports: [
    StatusDropdownCustomModuleComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StatusDropdownCustomModuleModule { }
