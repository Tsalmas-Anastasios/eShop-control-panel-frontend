import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LaddaModule } from 'angular2-ladda';
import { DataTablesModule } from 'angular-datatables';
import { HttpRequestInterceptor } from './services/http-request-interceptor.service';
import { ToastrModule } from 'ngx-toastr';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PhoneFormatPipe } from './pipes/phone-number-formatter.pipe';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';


import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import {
  NbThemeModule, NbLayoutModule, NbMenuModule, NbSidebarModule, NbToastrModule, NbDialogModule,
  NbDatepickerModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { DashboardModule } from './pages/layout/dashboard/dashboard.module';
import { SettingsModule } from './pages/layout/settings/settings.module';
import { DashboardViewModule } from './pages/dashboard-view/dashboard-view.module';
import { LoginModule } from './pages/auth/login/login.module';
import { PageNotFoundModule } from './pages/error-pages/page-not-found/page-not-found.module';
import { ConnectionLostModule } from './pages/error-pages/connection-lost/connection-lost.module';
import { OrdersListModule } from './pages/orders/orders-list/orders-list.module';
import { OrdersSearchModule } from './pages/global-search/orders-search/orders-search.module';
import { ProductsListModule } from './pages/products/products-list/products-list.module';
import { ProductModule } from './pages/products/product/product.module';
import { ProductsSearchModule } from './pages/global-search/products-search/products-search.module';
import { PrintModule } from './pages/layout/print/print.module';
import { PrintableDocumentsModule } from './pages/printable-documents/printable-documents.module';
import { CashRegisterModule } from './pages/cash-register/cash-register.module';




export function TranslateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/i18n/', '.json');
}



@NgModule({
  declarations: [
    AppComponent,
    PhoneFormatPipe,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgSelectModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    ToastrModule.forRoot(),
    LaddaModule.forRoot({
      style: 'zoom-out',
      spinnerSize: 30,
      spinnerColor: 'white',
      spinnerLines: 12,
    }),
    DataTablesModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbMenuModule.forRoot(),
    NbLayoutModule,
    NbEvaIconsModule,
    NbSidebarModule.forRoot(),
    NbToastrModule.forRoot(),
    NbDatepickerModule.forRoot(),
    DashboardModule,
    SettingsModule,
    PrintModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (TranslateHttpLoaderFactory),
        deps: [HttpClient],
      },
      defaultLanguage: 'en'
    }),
    NgxChartsModule,
    DashboardViewModule,
    LoginModule,
    PageNotFoundModule,
    ConnectionLostModule,
    CarouselModule,
    Daterangepicker,
    OrdersListModule,
    NbDialogModule.forRoot(),
    NgxPaginationModule,
    NgxSkeletonLoaderModule.forRoot({
      theme: {
        // Enabliong theme combination
        extendsFromRoot: true,
        // ... list of CSS theme attributes
        height: '20px',
      },
    }),
    CKEditorModule,
    OrdersSearchModule,
    ProductsListModule,
    ProductModule,
    ProductsSearchModule,
    PrintableDocumentsModule,
    CashRegisterModule,
  ],
  exports: [
    DashboardModule,
    SettingsModule,
    PrintModule,
    LoginModule,
    PageNotFoundModule,
    ConnectionLostModule,
    TranslateModule,
    OrdersListModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
