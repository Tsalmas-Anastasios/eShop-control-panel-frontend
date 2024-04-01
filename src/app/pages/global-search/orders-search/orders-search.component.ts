import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { PromiseOrdersModeling, SessionDataObject } from '../../../models';
import { environment } from '../../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-orders-search',
  templateUrl: './orders-search.component.html',
  styleUrls: ['./orders-search.component.scss']
})
export class OrdersSearchComponent implements OnInit {

  public orders: PromiseOrdersModeling[] = [];
  public searchers = {
    order_number: { value: null, label: 'order_number' },
    phone_number: { value: null, label: 'phone' },
    email_address: { value: null, label: 'email' },
    first_name: { value: null, label: 'first_name' },
    last_name: { value: null, label: 'last_name' },
    order_id: { value: null, label: 'order_id' },
  };
  private orders_page = 1;

  public user: SessionDataObject;

  constructor(
    public translate: TranslateService,
    private http: HttpClient,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private storageService: StorageService,
  ) {

    this.route.queryParams.subscribe(params => {
      this.searchers.order_number.value = params?.order_number || null;
      this.searchers.phone_number.value = params?.phone || null;
      this.searchers.email_address.value = params?.email || null;
      this.searchers.first_name.value = params?.first_name || null;
      this.searchers.last_name.value = params?.last_name || null;
      this.searchers.order_id.value = params?.order_id || null;


      for (const field in this.searchers)
        if (this.searchers[field].value !== null && this.searchers[field].value !== '') {
          this.searchOrders();
          break;
        }

      this.orders = [];
    });

  }

  ngOnInit(): void {
    this.user = this.storageService.getItem('user');
  }





  clearAdvancedFormData(): void {
    this.router.navigate(['/dashboard/search/orders']);
  }




  submitSearch(type: 'simple_search' | 'advanced_search'): void {

    const extras: NavigationExtras = {};
    extras.queryParams = {};
    if (type === 'simple_search')
      extras.queryParams = { order_number: this.searchers.order_number.value };
    else
      for (const field in this.searchers)
        if (this.searchers[field].label !== 'order_number')
          if (this.searchers[field].value !== null && this.searchers[field].value !== '')
            extras.queryParams[this.searchers[field].label] = this.searchers[field].value;


    this.router.navigate(['/dashboard/search/orders'], extras);

  }






  async searchOrders(): Promise<void> {

    this.spinner.show();



    let query_params = '';
    for (const field in this.searchers)
      if (this.searchers[field].value !== null && this.searchers[field].value !== '')
        query_params += `&${this.searchers[field].label}=${this.searchers[field].value}`;

    query_params = query_params.replace(/^.{1}/g, '');

    try {
      this.orders = await this.http.get<PromiseOrdersModeling[]>(`
        ${environment.params.host}/api/ecommerce/store/orders/search/global-search?${query_params}
      `).toPromise();

      if (!environment.production)
        console.log(this.orders);
    } catch (error) {

      this.spinner.hide();

      await this.utilsService.standardErrorHandling(error);
    }


    this.spinner.hide();

  }






  checkAdvancedRequiredFields(): boolean {

    if ((this.searchers.email_address.value === null || this.searchers.email_address.value === '' || this.searchers.email_address.value.length < 2)
      && (this.searchers.first_name.value === null || this.searchers.first_name.value === '' || this.searchers.first_name.value.length < 2)
      && (this.searchers.last_name.value === null || this.searchers.last_name.value === '' || this.searchers.last_name.value.length < 2)
      && (this.searchers.order_id.value === null || this.searchers.order_id.value === '' || this.searchers.order_id.value.length < 2)
      && (this.searchers.phone_number.value === null || this.searchers.phone_number.value === '' || this.searchers.phone_number.value.length < 2))
      return false;

    return true;

  }




  async loadMoreOrdersData(): Promise<void> {

    this.spinner.show();


    this.orders_page++;

    let query_params = '';
    for (const field in this.searchers)
      if (this.searchers[field].value !== null && this.searchers[field].value !== '')
        query_params += `&${this.searchers[field].label}=${this.searchers[field].value}`;

    query_params = query_params.replace(/^.{1}/g, '');

    try {
      const temp_orders = await this.http.get<PromiseOrdersModeling[]>(`
        ${environment.params.host}/api/ecommerce/store/orders/search/global-search?${query_params}&page=${this.orders_page}
      `).toPromise();

      this.orders = [...this.orders, ...temp_orders];

      if (!environment.production)
        console.log(this.orders);
    } catch (error) {

      this.spinner.hide();

      this.utilsService.standardErrorHandling(error);
    }


    this.spinner.hide();

  }

}
