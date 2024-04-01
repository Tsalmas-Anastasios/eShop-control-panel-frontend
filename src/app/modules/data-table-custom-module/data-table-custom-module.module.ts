import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableCustomModuleComponent } from './data-table-custom-module.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { StatusDropdownCustomModuleModule } from '../status-dropdown-custom-module/status-dropdown-custom-module.module';



@NgModule({
  declarations: [
    DataTableCustomModuleComponent
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    RouterModule,
    NgxSkeletonLoaderModule,
    StatusDropdownCustomModuleModule
  ],
  exports: [
    DataTableCustomModuleComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DataTableCustomModuleModule { }
