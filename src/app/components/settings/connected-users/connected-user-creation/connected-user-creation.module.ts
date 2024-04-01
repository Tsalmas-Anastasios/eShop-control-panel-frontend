import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectedUserCreationComponent } from './connected-user-creation.component';
import { FormsModule } from '@angular/forms';
import { RequiredFieldModule } from '../../../../modules/required-field/required-field.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NbAccordionModule } from '@nebular/theme';
import { UserPrivilegesModule } from '../user-privileges/user-privileges.module';



@NgModule({
  declarations: [
    ConnectedUserCreationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RequiredFieldModule,
    TranslateModule,
    NgxIntlTelInputModule,
    NbAccordionModule,
    UserPrivilegesModule,
  ],
  exports: [
    ConnectedUserCreationComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConnectedUserCreationModule { }
