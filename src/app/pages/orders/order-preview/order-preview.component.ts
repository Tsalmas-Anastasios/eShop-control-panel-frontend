import { HttpClient } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DataTableCustomModuleOptions, Order, OrderTypeSearch, StatusDropdownCustomModuleOptions,
  StatusDropdownCustomModuleStatusItem, OrderPaymentMethod, SessionDataObject
} from '../../../models';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from '../../../services/storage.service';


@Component({
  selector: 'app-order-preview',
  templateUrl: './order-preview.component.html',
  styleUrls: ['./order-preview.component.scss']
})
export class OrderPreviewComponent implements OnInit, OnChanges {

  @Input() order: OrderTypeSearch;

  public statuses: StatusDropdownCustomModuleStatusItem[] = [];
  public ordersTableOptions: DataTableCustomModuleOptions = {
    custom_table_classes: ['border-grey'],
    same_columns_as_headers: false,
  };
  public status_dropdown_options: StatusDropdownCustomModuleOptions = environment.status_dropdown_options;


  public payment_method_details: OrderPaymentMethod = null;

  public user: SessionDataObject;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private storageService: StorageService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.user = this.storageService.getItem('user');


    this.statuses = [
      { label: await this.translate.get('VIEWS.ORDERS_LIST.CONFIRMED').toPromise(), value: 'confirmed', letters_color: '#fffae6', background_color: '#ffcc00', order: 1 },
      { label: await this.translate.get('VIEWS.ORDERS_LIST.SENT').toPromise(), value: 'sent', letters_color: '#adadeb', background_color: '#3333cc', order: 2 },
      { label: await this.translate.get('VIEWS.ORDERS_LIST.COMPLETED').toPromise(), value: 'completed', letters_color: '#00b300', background_color: '#ccffcc', order: 3 },
      { label: await this.translate.get('VIEWS.ORDERS_LIST.RETURNED').toPromise(), value: 'returned', letters_color: '#f2f2f2', background_color: '#a6a6a6', order: 4 },
      { label: await this.translate.get('VIEWS.ORDERS_LIST.CANCELLED').toPromise(), value: 'archived', letters_color: '#ffe6e6', background_color: '#cc0000', order: 5 },
    ];




  }



  async ngOnChanges(changes): Promise<void> {
    this.order = changes.currentValue ? changes.currentValue.order : this.order;
  }


}
