import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsGlobalSearchComponent } from './products-global-search.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ProductsGlobalSearchComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    RouterModule,
  ],
  exports: [
    ProductsGlobalSearchComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductsGlobalSearchModule { }
