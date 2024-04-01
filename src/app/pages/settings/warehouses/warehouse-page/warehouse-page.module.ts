import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehousePageComponent } from './warehouse-page.component';
import { WarehousesSettingsRoutingModule } from '../warehouses-settings-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { WarehouseCreateModule } from '../../../../components/settings/warehouses/warehouse-create/warehouse-create.module';
import { LaddaModule } from 'angular2-ladda';
import { WarehouseDetailsModule } from '../../../../components/settings/warehouses/warehouse-details/warehouse-details.module';


@NgModule({
  declarations: [
    WarehousePageComponent
  ],
  imports: [
    CommonModule,
    WarehousesSettingsRoutingModule,
    TranslateModule,
    FormsModule,
    WarehouseCreateModule,
    LaddaModule,
    WarehouseDetailsModule
  ],
  exports: [
    WarehousePageComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WarehousePageModule { }
