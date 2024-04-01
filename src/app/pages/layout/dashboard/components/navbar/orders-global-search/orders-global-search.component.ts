import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../../../../services/utils.service';
import { PromiseOrdersModeling, SessionDataObject } from '../../../../../../models';
import { environment } from '../../../../../../../environments/environment';
import { StorageService } from '../../../../../..//services/storage.service';

@Component({
  selector: 'app-orders-global-search',
  templateUrl: './orders-global-search.component.html',
  styleUrls: ['./orders-global-search.component.scss']
})
export class OrdersGlobalSearchComponent implements OnInit {

  public orders: PromiseOrdersModeling[] = [];
  public searchers = {
    order_number: { value: null, label: 'order_number' },
    phone_number: { value: null, label: 'phone' },
    email_address: { value: null, label: 'email' },
    first_name: { value: null, label: 'first_name' },
    last_name: { value: null, label: 'last_name' },
    order_id: { value: null, label: 'order_id' },
  };
  public searchOrdersMenuLoader = false;

  public user: SessionDataObject;



  constructor(
    public translate: TranslateService,
    private http: HttpClient,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
    this.user = this.storageService.getItem('user');
  }


  async searchOrdersList(type: 'simple_search' | 'advanced_search'): Promise<void> {

    if (type === 'simple_search') {
      if (this.searchers.order_number.value === null || this.searchers.order_number.value === '' || this.searchers.order_number.value.length < 2) {
        this.orders = [];
        return;
      }
    } else if (type === 'advanced_search') {
      let flag = false;
      for (const field in this.searchers)
        if (this.searchers[field].value !== null && this.searchers[field].value !== '' && this.searchers[field].value.length >= 2)
          flag = true;

      if (!flag) return;
    }




    this.searchOrdersMenuLoader = true;

    let query_params = '';
    if (type === 'advanced_search') {
      for (const field in this.searchers)
        if (field !== 'order_number')
          query_params += `&${this.searchers[field].label}=${this.searchers[field].value}`;
    } else if (type === 'simple_search')
      query_params += `&${this.searchers.order_number.label}=${this.searchers.order_number.value}`;

    query_params = query_params.replace(/^.{1}/g, '');


    try {
      this.orders = await this.http.get<PromiseOrdersModeling[]>(`
        ${environment.params.host}/api/ecommerce/store/orders/search/global-search?${query_params}
      `).toPromise();

      if (!environment.production)
        console.log(this.orders);
    } catch (error) {

      this.searchOrdersMenuLoader = false;

      if (!environment.production)
        console.log(error);

      this.utilsService.showToast({
        message: await this.translate.get('GENERIC.ALERTS.SOMETHING_WENT_WRONG').toPromise(),
        type: 'error',
      });
    }


    this.searchOrdersMenuLoader = false;

  }




  checkAdvancedSearchFields(): boolean {

    if ((this.searchers.email_address.value === null || this.searchers.email_address.value === '')
      && (this.searchers.first_name.value === null || this.searchers.first_name.value === '')
      && (this.searchers.last_name.value === null || this.searchers.last_name.value === '')
      && (this.searchers.order_id.value === null || this.searchers.order_id.value === '')
      && (this.searchers.phone_number.value === null || this.searchers.phone_number.value === ''))
      return false;

    return true;

  }




  advancedSearchRedirectPageSearchGlobal(): void {

    const extras: NavigationExtras = {};
    extras.queryParams = {};
    for (const field in this.searchers)
      if (this.searchers[field].label !== 'order_number' && this.searchers[field].value !== '' && this.searchers[field].value !== null) {
        extras.queryParams[this.searchers[field].label] = this.searchers[field].value;
        this.searchers[field].value = null;
      }


    this.router.navigate(['/dashboard/search/orders'], extras);
    return;

  }



  simpleSearchRedirectPageSearchGlobal(): void {

    const extras: NavigationExtras = {};
    extras.queryParams = {};
    extras.queryParams[this.searchers.order_number.label] = this.searchers.order_number.value;
    this.searchers.order_number.value = null;
    this.router.navigate(['/dashboard/search/orders'], extras);
    return;

  }

}
