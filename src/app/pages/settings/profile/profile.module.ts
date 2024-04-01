import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbAccordionModule } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ProfileComponent } from './profile.component';
import { SettingsRoutingModule } from '../settings-routing.module';
import { RequiredFieldModule } from '../../../modules/required-field/required-field.module';
import { NgxKjuaModule } from 'ngx-kjua';
import { UsingBizyhiveCollapseModule } from '../../../components/using-bizyhive-collapse/using-bizyhive-collapse.module';



@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NbAccordionModule,
    TranslateModule,
    LaddaModule,
    NgxIntlTelInputModule,
    SettingsRoutingModule,
    RequiredFieldModule,
    NgxKjuaModule,
    UsingBizyhiveCollapseModule,
  ],
  exports: [
    ProfileComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileModule { }
