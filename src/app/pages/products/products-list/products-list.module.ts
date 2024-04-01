import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProductsListComponent } from './products-list.component';
import { ProductsRoutingModule } from '../products-routing.module';
import { DataTableCustomModuleModule } from '../../../modules/data-table-custom-module/data-table-custom-module.module';



@NgModule({
  declarations: [
    ProductsListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NgxSpinnerModule,
    NgSelectModule,
    ProductsRoutingModule,
    DataTableCustomModuleModule,
  ],
  exports: [
    ProductsListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductsListModule { }
