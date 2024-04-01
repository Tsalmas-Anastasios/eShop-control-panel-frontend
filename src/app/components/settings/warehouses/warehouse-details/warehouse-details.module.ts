import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseDetailsComponent } from './warehouse-details.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RequiredFieldModule } from '../../../../modules/required-field/required-field.module';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  NbTooltipModule, NbDatepickerModule, NbInputModule, NbAccordionModule
} from '@nebular/theme';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { DatepickerModule } from 'ng2-datepicker';



@NgModule({
  declarations: [
    WarehouseDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NgSelectModule,
    NbTooltipModule,
    NbDatepickerModule,
    NbInputModule,
    NbAccordionModule,
    NgxIntlTelInputModule,
    DatepickerModule,
    RequiredFieldModule,
  ],
  exports: [
    WarehouseDetailsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WarehouseDetailsModule { }
