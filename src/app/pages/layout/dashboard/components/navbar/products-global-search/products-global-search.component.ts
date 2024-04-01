import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../../../../services/utils.service';
import { PromiseProductsModeling, SessionDataObject } from '../../../../../../models';
import { environment } from '../../../../../../../environments/environment';
import { StorageService } from '../.,/../../../../../../services/storage.service';

@Component({
  selector: 'app-products-global-search',
  templateUrl: './products-global-search.component.html',
  styleUrls: ['./products-global-search.component.scss']
})
export class ProductsGlobalSearchComponent implements OnInit {

  public products: PromiseProductsModeling[] = [];

  public searchers: {
    product_number: { label: string, value: string },
    headline: { label: string, value: string },
    product_brand: { label: string, value: string },
    product_model: { label: string, value: string },
  } = {
      product_number: { label: 'product_code', value: null },
      headline: { label: 'headline', value: null },
      product_brand: { label: 'product_brand', value: null },
      product_model: { label: 'product_model', value: null },
    };


  public searcherLoadingProducts = false;

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





  async searchProductsList(type: 'simple_search' | 'advanced_search'): Promise<void> {

    if (type === 'simple_search') {
      if (this.searchers.product_number.value === null || this.searchers.product_number.value === '' || this.searchers.product_number.value.length < 2) {
        this.products = [];
        return;
      }
    } else {
      let flag = false;
      for (const field in this.searchers)
        if (this.searchers[field].value !== null && this.searchers[field].value !== '' && this.searchers[field].value.length >= 2)
          flag = true;

      if (!flag) return;
    }


    this.searcherLoadingProducts = true;


    let query_params = '';
    if (type === 'advanced_search') {
      for (const field in this.searchers)
        if (field !== 'product_number')
          query_params += `&${this.searchers[field].label}=${this.searchers[field].value}`;
    } else
      query_params += `&${this.searchers.product_number.label}=${this.searchers.product_number.value}`;


    try {

      this.products = await this.http.get<PromiseProductsModeling[]>(`
        ${environment.params.host}/api/ecommerce/store/products/search/global-search?${query_params}
      `).toPromise();

      for (const product of this.products)
        for (const image of product.images)
          if (image.main_image) {
            product.main_image = image.url;
            break;
          }



      if (!environment.production)
        console.log(this.products);

    } catch (error) {

      this.searcherLoadingProducts = false;

      if (!environment.production)
        console.log(error);

      this.utilsService.showToast({
        message: await this.translate.get('GENERIC.ALERTS.SOMETHING_WENT_WRONG').toPromise(),
        type: 'error',
      });
    }


    this.searcherLoadingProducts = false;

  }




  checkRequiredFieldToDisableSearch(): boolean {

    if ((this.searchers.headline.value === null || this.searchers.headline.value === '' || this.searchers.headline.value.length < 2)
      && (this.searchers.product_brand.value === null || this.searchers.product_brand.value === '' || this.searchers.product_brand.value.length < 2)
      && (this.searchers.product_model.value === null || this.searchers.product_model.value === '' || this.searchers.product_model.value.length < 2))
      return false;

    return true;

  }




  advancedSearchRedirectPageSearchGlobal(): void {

    const extras: NavigationExtras = {};
    extras.queryParams = {};
    for (const field in this.searchers)
      if (this.searchers[field].label !== 'product_code' && this.searchers[field].value !== '' && this.searchers[field].value !== null) {
        extras.queryParams[this.searchers[field].label] = this.searchers[field].value;
        this.searchers[field].value = null;
      }



    this.router.navigate(['/dashboard/search/products'], extras);
    return;
  }




  simpleSearchRedirectPageSearchGlobal(): void {

    const extras: NavigationExtras = {};
    extras.queryParams = {};
    extras.queryParams[this.searchers.product_number.label] = this.searchers.product_number.value;
    this.searchers.product_number.value = null;
    this.router.navigate(['/dashboard/search/products'], extras);
    return;

  }
}
