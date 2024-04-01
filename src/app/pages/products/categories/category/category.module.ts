import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CategoryComponent } from './category.component';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { RequiredFieldModule } from '../../../../modules/required-field/required-field.module';



@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    RequiredFieldModule
  ],
  exports: [
    CategoryComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CategoryModule { }
