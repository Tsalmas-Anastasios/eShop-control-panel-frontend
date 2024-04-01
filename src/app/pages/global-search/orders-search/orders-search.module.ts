import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersSearchComponent } from './orders-search.component';
import { OrdersSearchRoutingModule } from './orders-search-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [
    OrdersSearchComponent
  ],
  imports: [
    CommonModule,
    OrdersSearchRoutingModule,
    TranslateModule,
    FormsModule,
    NgxSpinnerModule
  ],
  exports: [
    OrdersSearchComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrdersSearchModule { }
