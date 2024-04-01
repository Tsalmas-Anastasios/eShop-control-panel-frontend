import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NbTagModule, NbListModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { ProductDetailsComponent } from './product-details.component';
import { RequiredFieldModule } from '../../../modules/required-field/required-field.module';
import { StatusDropdownCustomModuleModule } from '../../../modules/status-dropdown-custom-module/status-dropdown-custom-module.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';



@NgModule({
  declarations: [
    ProductDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    NbTagModule,
    NbListModule,
    TranslateModule,
    RequiredFieldModule,
    StatusDropdownCustomModuleModule,
    CKEditorModule,
    NgxDropzoneModule,
    NgxSkeletonLoaderModule,
  ],
  exports: [
    ProductDetailsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductDetailsModule { }
