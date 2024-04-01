import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NbAccordionModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LaddaModule } from 'angular2-ladda';
import { CompanyDataComponent } from './company-data.component';
import { SettingsRoutingModule } from '../settings-routing.module';
import { RequiredFieldModule } from '../../../modules/required-field/required-field.module';
import { WhyCompanyDataAreImportantModule } from '../../../components/why-company-data-are-important/why-company-data-are-important.module';
import { UsingBizyhiveCollapseModule } from '../../../components/using-bizyhive-collapse/using-bizyhive-collapse.module';



@NgModule({
  declarations: [
    CompanyDataComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NbAccordionModule,
    TranslateModule,
    NgSelectModule,
    NgxIntlTelInputModule,
    NgxDropzoneModule,
    SettingsRoutingModule,
    RequiredFieldModule,
    LaddaModule,
    WhyCompanyDataAreImportantModule,
    UsingBizyhiveCollapseModule,
  ],
  exports: [
    CompanyDataComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CompanyDataModule { }
