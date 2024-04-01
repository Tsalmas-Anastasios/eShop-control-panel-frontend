import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersListComponent } from './orders-list.component';
import { OrdersRoutingModule } from '../orders-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DataTablesModule } from 'angular-datatables';
import { NbTreeGridModule } from '@nebular/theme';
import { DataTableCustomModuleModule } from '../../../modules/data-table-custom-module/data-table-custom-module.module';
import { FormsModule } from '@angular/forms';
import { OrderPreviewModule } from '../order-preview/order-preview.module';
import { RouterModule } from '@angular/router';






@NgModule({
  declarations: [
    OrdersListComponent,
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    TranslateModule,
    Ng2SmartTableModule,
    DataTablesModule,
    NbTreeGridModule,
    DataTableCustomModuleModule,
    FormsModule,
    OrderPreviewModule,
    RouterModule,
  ],
  exports: [
    OrdersListComponent,
    OrdersRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class OrdersListModule { }
