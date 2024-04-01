import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsingBizyhiveCollapseComponent } from './using-bizyhive-collapse.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    UsingBizyhiveCollapseComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    UsingBizyhiveCollapseComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsingBizyhiveCollapseModule { }
