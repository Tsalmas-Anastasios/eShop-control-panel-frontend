import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyEmailComponent } from './company-email.component';
import { SettingsIntegrationsRoutingModule } from '../settings-integrations--routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTableCustomModuleModule } from '../../../../modules/data-table-custom-module/data-table-custom-module.module';
import { RequiredFieldModule } from '../../../../modules/required-field/required-field.module';
import { LaddaModule } from 'angular2-ladda';



@NgModule({
  declarations: [
    CompanyEmailComponent
  ],
  imports: [
    CommonModule,
    SettingsIntegrationsRoutingModule,
    TranslateModule,
    FormsModule,
    NgxSpinnerModule,
    DataTableCustomModuleModule,
    RequiredFieldModule,
    LaddaModule,
  ],
  exports: [
    CompanyEmailComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CompanyEmailModule { }
