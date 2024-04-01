import { DataTableCustomModuleModule } from './../../../modules/data-table-custom-module/data-table-custom-module.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { ProductsInventoryRoutingModule } from '../products-inventory-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    ProductsInventoryRoutingModule,
    TranslateModule,
    DataTableCustomModuleModule,
    FormsModule
  ],
  exports: [
    ListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListModule { }
