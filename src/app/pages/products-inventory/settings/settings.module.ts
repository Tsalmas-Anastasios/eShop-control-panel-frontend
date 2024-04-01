import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { ProductsInventoryRoutingModule } from '../products-inventory-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NbAccordionModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';


@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    ProductsInventoryRoutingModule,
    TranslateModule,
    NbAccordionModule,
    NgSelectModule,
    FormsModule,
    LaddaModule
  ],
  exports: [
    SettingsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingsModule { }
