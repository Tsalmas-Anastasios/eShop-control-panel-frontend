import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsSearchComponent } from './products-search.component';
import { ProductsSearchRoutingModule } from './products-search-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [
    ProductsSearchComponent
  ],
  imports: [
    CommonModule,
    ProductsSearchRoutingModule,
    TranslateModule,
    FormsModule,
    NgxSpinnerModule
  ],
  exports: [
    ProductsSearchComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductsSearchModule { }
