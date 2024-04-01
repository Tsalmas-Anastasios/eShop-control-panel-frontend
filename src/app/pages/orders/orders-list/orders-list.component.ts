import { StorageService } from './../../../services/storage.service';
import { OrderDocumentsCreateService } from './../../../services/order-documents-create.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild, TemplateRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NbDialogService } from '@nebular/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import {
  DataTableCustomModuleOptions, DataTableCustomModuleHeaders, Order,
  StatusDropdownCustomModuleStatusItem, StatusDropdownCustomModuleOptions, OrderTypeSearch, OrderDocumentsPrintOptions, UserPrivilegesSettings
} from '../../../models';
import { UtilsService } from '../../../services/utils.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';




@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {


  public columnHeaders: DataTableCustomModuleHeaders[] = [];

  public statuses: StatusDropdownCustomModuleStatusItem[] = environment.params.arrays.order_statuses.all_formatted;

  public ordersTableOptions: DataTableCustomModuleOptions = {
    ...environment.custom_dtTables,
    make_records_bold: true,
    make_records_bold__field: 'order_seen',
    make_records_bold__field_value_equal: false
  };

  public status_dropdown_options: StatusDropdownCustomModuleOptions = environment.status_dropdown_options;

  public orders_list: OrderTypeSearch[] = [];
  public order: OrderTypeSearch = null;
  private list_page = 1;

  public user_privileges: UserPrivilegesSettings;




  public orders_condition: 'all_orders' | 'in_progress' | 'sent' | 'completed' | 'returned' | 'cancelled';
  private orders_accepted_params: string[] = ['all_orders', 'in_progress', 'sent', 'completed', 'returned', 'cancelled'];
  public title_list = {};


  private routeLoaded = false;


  public previewModalShow = false;
  public printOrderModalShow = false;

  // orders print options (for modal checkboxes ngModel)
  public orderPrintOptions: OrderDocumentsPrintOptions = {
    order_dispatch_form: false,
    order_document: false,
    proof_of_order: false,
    tracking_number: false,
  };



  constructor(
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private seo: SeoService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private utilsService: UtilsService,
    private changeDetectorRef: ChangeDetectorRef,
    private nbDialogService: NbDialogService,
    public orderDocumentsCreateService: OrderDocumentsCreateService,
    private storageService: StorageService,
  ) {
    this.storageService.removeItem('orders_condition');
    this.changeDisplayedOrderStatus('');
  }




  async ngOnInit(): Promise<void> {

    this.spinner.show();

    this.user_privileges = this.utilsService.getUsersPrivileges();


    this.orders_condition = this.storageService.getItem('orders_condition');
    if (this.orders_condition === null)
      this.storageService.setItem('orders_condition', 'all_orders');

    this.title_list = {
      all_orders: await this.translate.get('VIEWS.ORDERS_LIST.ALL_ORDERS').toPromise(),
      in_progress: await this.translate.get('VIEWS.ORDERS_LIST.IN_PROGRESS_ORDERS').toPromise(),
      sent: await this.translate.get('VIEWS.ORDERS_LIST.SENT_ORDERS').toPromise(),
      completed: await this.translate.get('VIEWS.ORDERS_LIST.COMPLETED_ORDERS').toPromise(),
      returned: await this.translate.get('VIEWS.ORDERS_LIST.RETURNED_ORDERS').toPromise(),
      cancelled: await this.translate.get('VIEWS.ORDERS_LIST.CANCELLED_ORDERS').toPromise()
    };

    // this.orders_condition = this.route.snapshot.queryParams.orders_condition || 'all_orders';

    this.seo.updatePageMetadata({ title: `${this.title_list[this.orders_condition]} | ${await this.translate.get('VIEWS.ORDERS_LIST.GENERAL_LIST_TAB_TITLE').toPromise()}` });




    this.columnHeaders = [
      { title: '#', field: 'id', auto_increment: true, identifier: false, width: '80px', text_align: 'center', header_text_align: 'header-center', header_text_fields_text_align: 'center' },
      { title: await this.translate.get('VIEWS.ORDERS_LIST.ORDER_ID').toPromise(), field: 'order_number_formatted', auto_increment: false, identifier: true, width: 'calc(calc(100% - 240px) / 5)' },
      { title: await this.translate.get('VIEWS.ORDERS_LIST.NAME').toPromise(), field: 'first_name last_name', auto_increment: false, identifier: false, width: 'calc(calc(100% - 240px) / 5)' },
      { title: await this.translate.get('VIEWS.ORDERS_LIST.ADDRESS').toPromise(), field: 'address, city, postal_code', auto_increment: false, identifier: false, width: 'calc(calc(100% - 240px) / 5)' },
      { title: await this.translate.get('VIEWS.ORDERS_LIST.TRACKING_NUMBER').toPromise(), field: 'tracking_number', auto_increment: false, identifier: false, width: 'calc(calc(100% - 240px) / 5)' },
      { title: await this.translate.get('VIEWS.ORDERS_LIST.STATUS').toPromise(), field: 'current_status', auto_increment: false, identifier: false, width: 'calc(calc(100% - 240px) / 5)', specify_field: 'status_dropdown', header_text_fields_text_align: 'center' },
      { title: '', field: 'actions_custom_field_printOrder', auto_increment: false, identifier: false, width: '40px', header_text_fields_text_align: 'center' },
      { title: '', field: 'actions_custom_field_previewOrder', auto_increment: false, identifier: false, width: '40px', header_text_fields_text_align: 'center' },
      { title: '', field: 'actions_custom_field_completeOrder', auto_increment: false, identifier: false, width: '40px', header_text_fields_text_align: 'center' },
    ];


    if (this.user_privileges?.orders_edit)
      this.columnHeaders.push({ title: '', field: 'actions_custom_field_editOrder', auto_increment: false, identifier: false, width: '40px', header_text_fields_text_align: 'center' });






    // initialize orders list
    // this.orders_list = [];
    await this.loadOrdersData(false);








    this.spinner.hide();
  }






  async loadOrdersData(ending: boolean): Promise<void> {

    try {

      if (this.orders_condition === 'all_orders')
        this.orders_list = await this.http.get<OrderTypeSearch[]>(
          `${environment.params.host}/api/ecommerce/store/orders/orders?page=${this.list_page}`
        ).toPromise();
      else if (this.orders_condition === 'in_progress')         // in_progress --> confirmed
        this.orders_list = await this.http.get<OrderTypeSearch[]>(
          `${environment.params.host}/api/ecommerce/store/orders/specific-orders?current_status=confirmed&page=${this.list_page}`
        ).toPromise();
      else if (this.orders_condition === 'sent')
        this.orders_list = await this.http.get<OrderTypeSearch[]>(
          `${environment.params.host}/api/ecommerce/store/orders/specific-orders?current_status=sent&page=${this.list_page}`
        ).toPromise();
      else if (this.orders_condition === 'cancelled')             // cancelled --> archived
        this.orders_list = await this.http.get<OrderTypeSearch[]>(
          `${environment.params.host}/api/ecommerce/store/orders/specific-orders?current_status=archived&page=${this.list_page}`
        ).toPromise();
      else if (this.orders_condition === 'completed')
        this.orders_list = await this.http.get<OrderTypeSearch[]>(
          `${environment.params.host}/api/ecommerce/store/orders/specific-orders?current_status=completed&page=${this.list_page}`
        ).toPromise();
      else if (this.orders_condition === 'returned')
        this.orders_list = await this.http.get<OrderTypeSearch[]>(
          `${environment.params.host}/api/ecommerce/store/orders/specific-orders?current_status=returned&page=${this.list_page}`
        ).toPromise();




      await this.initializeParsingOrdersData(this.orders_list);

      if (ending)
        this.list_page++;

    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }

  }







  async initializeParsingOrdersData(orders: OrderTypeSearch[]): Promise<void> {


    for (let i = 0; i < orders.length; i++) {

      const new_order = {
        ...orders[i],
        order_number_formatted: {
          label: 'field order_number',
          run_function: this.quickActions_previewOrder,
          parameters: {
            order_id: 'order_id'
          },
          event: 'click',
        },
        actions_custom_field_printOrder: {
          label: '<i class="fas fa-print"></i>',
          run_function: this.quickActions_printOrder,
          parameters: {
            order_id: 'order_id'
          },
          event: 'click',
          letters_color: '#b38f00',
        },
        actions_custom_field_previewOrder: {
          label: '<i class="fas fa-eye"></i>',
          run_function: this.quickActions_previewOrder,
          parameters: {
            order_id: 'order_id'
          },
          event: 'click',
          letters_color: '#506FDE',
        },
        actions_custom_field_completeOrder: {
          label: '<i class="fas fa-check-circle"></i>',
          run_function: this.quickActions_completeOrder,
          parameters: {
            order_id: 'order_id'
          },
          event: 'click',
          letters_color: '#229D18',
        },
      };

      if (this.user_privileges?.orders_edit)
        new_order['actions_custom_field_editOrder'] = {
          label: '<i class="fas fa-edit"></i>',
          run_function: this.quickActions_editOrder,
          parameters: {
            order_id: 'order_id'
          },
          event: 'click',
          letters_color: '#02133E',
        };

      // initialize actions
      this.orders_list[i] = {
        ...new_order
      };

    }



    if (!environment.production)
      console.log(this.orders_list);



  }





  async changeDisplayedOrderStatus(new_status: 'all_orders' | 'in_progress' | 'sent' | 'completed' | 'returned' | 'cancelled' | ''): Promise<void> {

    const current = this.storageService.getItem('orders_condition');
    if (current === null && new_status === '')
      this.storageService.setItem('orders_condition', 'all_orders');

    if (new_status !== '')
      this.storageService.setItem('orders_condition', new_status);


    await this.ngOnInit();

  }









  public quickActions_printOrder = async (parameters: { order_id: string }) => {

    for (let i = 0; i < this.orders_list.length; i++)
      if (this.orders_list[i].order_id === parameters.order_id)
        this.order = this.orders_list[i];



    // falsing all the attributes and checkpoints
    for (const option in this.orderPrintOptions)
      this.orderPrintOptions[option] = false;


    this.printOrderModalShow = true;
  }




  public quickActions_previewOrder = async (parameters: { order_id: string }) => {

    try {
      await this.seeOrder(parameters.order_id);
    } catch (error) {
      this.utilsService.standardErrorHandling(error);
      return Promise.resolve();
    }

    this.router.navigate([`/dashboard/orders/${parameters.order_id}`]);
  }



  public quickActions_completeOrder = async (parameters: { order_id: string }) => {

    try {
      await this.seeOrder(parameters.order_id);
    } catch (error) {
      this.utilsService.standardErrorHandling(error);
      return Promise.resolve();
    }



    try {

      this.spinner.show();

      const response = await this.http.put<any>(
        `${environment.params.host}/api/ecommerce/store/orders/${parameters.order_id}/completed`,
        null
      ).toPromise();



      // change in the current array
      for (let order of this.orders_list)
        if (order.order_id === parameters.order_id) {
          order = await this.http.get<OrderTypeSearch>(`
            ${environment.params.host}/api/ecommerce/store/orders/${order.order_id}
          `).toPromise();

          break;
        }


      this.spinner.hide();

    } catch (error) {
      this.spinner.hide();


      await this.utilsService.standardErrorHandling(error);
    }

  }



  public quickActions_editOrder = async (parameters: { order_id: string }) => {
    try {
      await this.seeOrder(parameters.order_id);
    } catch (error) {
      this.utilsService.standardErrorHandling(error);
      return Promise.resolve();
    }

    this.router.navigate([`dashboard/orders/${parameters.order_id}`], { queryParams: { mode: 'edit' } });
  }



  async orderStatusChange(data: { identifier: string, new_status: string }): Promise<void> {

    try {
      await this.seeOrder(data.identifier);
    } catch (error) {
      this.utilsService.standardErrorHandling(error);
      return Promise.resolve();
    }


  }





  closeModal(name: 'preview' | 'print'): void {

    if (name === 'preview')
      this.previewModalShow = false;
    else if (name === 'print')
      this.printOrderModalShow = false;

  }





  printOptionsSelected(): boolean {

    for (const option in this.orderPrintOptions)
      if (this.orderPrintOptions[option])
        return true;

    return false;

  }







  async archiveOrder(order_id: string): Promise<void> {


    try {

      this.spinner.show();

      const response = await this.http.put<any>(
        `${environment.params.host}/api/ecommerce/store/orders/${order_id}/archive`,
        null
      ).toPromise();



      // change in the current array
      for (let order of this.orders_list)
        if (order.order_id === order_id) {
          order = await this.http.get<OrderTypeSearch>(`
            ${environment.params.host}/api/ecommerce/store/orders/${order.order_id}
          `).toPromise();

          break;
        }


      this.spinner.hide();

    } catch (error) {
      this.spinner.hide();


      await this.utilsService.standardErrorHandling(error);
    }


  }




  async sendOrder(order_id: string): Promise<void> {

    try {

      this.spinner.show();

      const response = await this.http.put<any>(
        `${environment.params.host}/api/ecommerce/store/orders/${order_id}/sent`,
        null
      ).toPromise();



      // change in the current array
      for (let order of this.orders_list)
        if (order.order_id === order_id) {
          order = await this.http.get<OrderTypeSearch>(`
            ${environment.params.host}/api/ecommerce/store/orders/${order.order_id}
          `).toPromise();

          break;
        }


      this.spinner.hide();

    } catch (error) {
      this.spinner.hide();


      await this.utilsService.standardErrorHandling(error);
    }

  }



  async seeOrder(order_id: string): Promise<void> {

    try {

      const response = await this.http.put<any>(`${environment.params.host}/api/ecommerce/store/orders/${order_id}/order-seen`, null).toPromise();

    } catch (error) {
      return Promise.reject(error);
    }

  }




}
