import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseCreateComponent } from './warehouse-create.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RequiredFieldModule } from '../../../../modules/required-field/required-field.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NbTooltipModule, NbDatepickerModule, NbInputModule } from '@nebular/theme';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { DatepickerModule } from 'ng2-datepicker';


@NgModule({
  declarations: [
    WarehouseCreateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    RequiredFieldModule,
    NgSelectModule,
    NbTooltipModule,
    NbDatepickerModule,
    NbInputModule,
    NgxIntlTelInputModule,
    DatepickerModule,
  ],
  exports: [
    WarehouseCreateComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WarehouseCreateModule { }
