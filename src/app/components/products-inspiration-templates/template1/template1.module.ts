import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Template1Component } from './template1.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';


@NgModule({
  declarations: [
    Template1Component
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgxSkeletonLoaderModule,
  ],
  exports: [
    Template1Component
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Template1Module { }
