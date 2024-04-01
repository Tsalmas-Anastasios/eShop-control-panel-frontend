import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ListComponent } from './list.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { ProductsCategoriesRoutingModule } from '../products-categories--routing.module';
import { DataTableCustomModuleModule } from '../../../../modules/data-table-custom-module/data-table-custom-module.module';
import { CategoryModule } from '../category/category.module';



@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgxSpinnerModule,
    FormsModule,
    ProductsCategoriesRoutingModule,
    DataTableCustomModuleModule,
    CategoryModule,
  ],
  exports: [
    ListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListModule { }
