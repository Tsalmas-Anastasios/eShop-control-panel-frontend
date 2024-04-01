import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PageNotFoundComponent } from './page-not-found.component';



@NgModule({
  declarations: [
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    PageNotFoundComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PageNotFoundModule { }
