import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LaddaModule } from 'angular2-ladda';
import { ProductComponent } from './product.component';
import { ProductCreateModule } from '../../../components/product/product-create/product-create.module';
import { ProductDetailsModule } from '../../../components/product/product-details/product-details.module';
import { Template1Module } from '../../../components/products-inspiration-templates/template1/template1.module';


@NgModule({
  declarations: [
    ProductComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    LaddaModule,
    ProductCreateModule,
    ProductDetailsModule,
    Template1Module,
  ],
  exports: [
    ProductComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductModule { }
