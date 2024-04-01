import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectedUserDetailsComponent } from './connected-user-details.component';
import { FormsModule } from '@angular/forms';
import { RequiredFieldModule } from 'src/app/modules/required-field/required-field.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NbAccordionModule, NbBadgeModule } from '@nebular/theme';
import { UserPrivilegesModule } from '../user-privileges/user-privileges.module';



@NgModule({
  declarations: [
    ConnectedUserDetailsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RequiredFieldModule,
    TranslateModule,
    NgxIntlTelInputModule,
    NbAccordionModule,
    NbBadgeModule,
    UserPrivilegesModule,
  ],
  exports: [
    ConnectedUserDetailsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConnectedUserDetailsModule { }
