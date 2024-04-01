import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from './contact-form.component';
import { NbAlertModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DatepickerModule } from 'ng2-datepicker';
import { NbDatepickerModule, NbTagModule, NbAccordionModule, NbBadgeModule } from '@nebular/theme';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  declarations: [
    ContactFormComponent
  ],
  imports: [
    CommonModule,
    NbAlertModule,
    TranslateModule,
    FormsModule,
    NgSelectModule,
    DatepickerModule,
    NbDatepickerModule,
    NbTagModule,
    NbAccordionModule,
    NbBadgeModule,
    NgxIntlTelInputModule
  ],
  exports: [
    ContactFormComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactFormModule { }
