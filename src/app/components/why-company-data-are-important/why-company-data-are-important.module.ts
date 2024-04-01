import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhyCompanyDataAreImportantComponent } from './why-company-data-are-important.component';


@NgModule({
  declarations: [
    WhyCompanyDataAreImportantComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    WhyCompanyDataAreImportantComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WhyCompanyDataAreImportantModule { }
