import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { NbTagModule, NbSpinnerModule } from '@nebular/theme';
import { ProductCreateComponent } from './product-create.component';
import { RequiredFieldModule } from '../../../modules/required-field/required-field.module';
import { StatusDropdownCustomModuleModule } from '../../../modules/status-dropdown-custom-module/status-dropdown-custom-module.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';



@NgModule({
  declarations: [
    ProductCreateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    TranslateModule,
    NbTagModule,
    NbSpinnerModule,
    RequiredFieldModule,
    StatusDropdownCustomModuleModule,
    CKEditorModule,
    NgxDropzoneModule,
  ],
  exports: [
    ProductCreateComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductCreateModule { }
