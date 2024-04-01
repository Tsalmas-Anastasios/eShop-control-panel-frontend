import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersGlobalSearchComponent } from './orders-global-search.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { RouterModule } from '@angular/router';





@NgModule({
  declarations: [
    OrdersGlobalSearchComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgSelectModule,
    FormsModule,
    LaddaModule,
    RouterModule
  ],
  exports: [
    OrdersGlobalSearchComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrdersGlobalSearchModule { }
