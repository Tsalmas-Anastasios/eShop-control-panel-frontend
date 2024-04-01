import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardViewComponent } from './dashboard-view.component';
import { DashboardViewRoutingModule } from './dashboard-view-routing.module';
import { NbCardModule, NbAlertModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';



@NgModule({
  declarations: [
    DashboardViewComponent
  ],
  imports: [
    CommonModule,
    DashboardViewRoutingModule,
    NbCardModule,
    TranslateModule,
    NgxChartsModule,
    CarouselModule,
    Daterangepicker,
    NbAlertModule,
    NgxSkeletonLoaderModule,
  ],
  exports: [
    DashboardViewComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardViewModule { }
