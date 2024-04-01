import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { WarehousesSettingsRoutingModule } from '../warehouses-settings-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTableCustomModuleModule } from '../../../../modules/data-table-custom-module/data-table-custom-module.module';



@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    WarehousesSettingsRoutingModule,
    TranslateModule,
    NgxSpinnerModule,
    DataTableCustomModuleModule,
  ],
  exports: [
    ListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WarehousesSettingsListModule { }
