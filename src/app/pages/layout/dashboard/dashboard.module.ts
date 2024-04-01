import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbLayoutModule, NbSearchModule, NbActionsModule, NbSidebarModule } from '@nebular/theme';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardComponent } from './dashboard.component';
import { NavbarModule } from './components/navbar/navbar.module';
import { SidebarModule } from './components/sidebar/sidebar.module';
import { FooterModule } from './components/footer/footer.module';
import { OrdersGlobalSearchModule } from './components/navbar/orders-global-search/orders-global-search.module';
import { ProductsGlobalSearchModule } from './components/navbar/products-global-search/products-global-search.module';




@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    NavbarModule,
    SidebarModule,
    FooterModule,
    NbLayoutModule,
    NbActionsModule,
    NbSearchModule,
    NbSidebarModule,
    NgxSpinnerModule,
    OrdersGlobalSearchModule,
    ProductsGlobalSearchModule,
  ],
  exports: [
    DashboardComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule { }
