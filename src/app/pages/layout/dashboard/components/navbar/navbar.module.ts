import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbActionsModule, NbSearchModule, NbContextMenuModule
} from '@nebular/theme';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavbarComponent } from './navbar.component';
import { OrdersGlobalSearchModule } from './orders-global-search/orders-global-search.module';
import { ProductsGlobalSearchModule } from './products-global-search/products-global-search.module';



@NgModule({
  declarations: [
    NavbarComponent,
  ],
  imports: [
    CommonModule,
    NbActionsModule,
    NbContextMenuModule,
    NbSearchModule,
    RouterModule,
    TranslateModule,
    OrdersGlobalSearchModule,
    ProductsGlobalSearchModule,
  ],
  exports: [
    NavbarComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NavbarModule { }
