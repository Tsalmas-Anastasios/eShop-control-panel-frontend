import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list.component';
import { SettingsConnectedUsersRoutingModule } from '../settings-connected-users-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NbAccordionModule } from '@nebular/theme';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DataTableCustomModuleModule } from '../../../../modules/data-table-custom-module/data-table-custom-module.module';
import { UsingBizyhiveCollapseModule } from '../../../../components/using-bizyhive-collapse/using-bizyhive-collapse.module';



@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    SettingsConnectedUsersRoutingModule,
    NbAccordionModule,
    NgxSpinnerModule,
    DataTableCustomModuleModule,
    UsingBizyhiveCollapseModule,
  ],
  exports: [
    ListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListModule { }
