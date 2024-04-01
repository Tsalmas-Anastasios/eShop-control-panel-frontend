import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewCategoryComponent } from './new-category.component';
import { ProductsCategoriesRoutingModule } from '../products-categories--routing.module';
import { CategoryModule } from '../category/category.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [
    NewCategoryComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ProductsCategoriesRoutingModule,
    CategoryModule,
    TranslateModule,
    NgxSpinnerModule,
  ],
  exports: [
    NewCategoryComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NewCategoryModule { }
