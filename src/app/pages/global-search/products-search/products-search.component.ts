import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { PromiseProductsModeling, SessionDataObject } from '../../../models';
import { environment } from '../../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { StorageService } from '../../../services/storage.service';


@Component({
  selector: 'app-products-search',
  templateUrl: './products-search.component.html',
  styleUrls: ['./products-search.component.scss']
})
export class ProductsSearchComponent implements OnInit {


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
      this.searchers.product_number.value = params?.product_code || null;
      this.searchers.headline.value = params?.headline || null;
      this.searchers.product_brand.value = params?.product_brand || null;
      this.searchers.product_model.value = params?.product_model || null;


      for (const field in this.searchers)
        if (this.searchers[field].value !== null && this.searchers[field].value !== '') {
          this.searchOrders();
          break;
        }

      this.products = [];
    });

  }

  ngOnInit(): void {
    this.user = this.storageService.getItem('user');
  }





  checkRequiredFieldToDisableSearch(): boolean {

    if ((this.searchers.headline.value === null || this.searchers.headline.value === '' || this.searchers.headline.value.length < 2)
      && (this.searchers.product_brand.value === null || this.searchers.product_brand.value === '' || this.searchers.product_brand.value.length < 2)
      && (this.searchers.product_model.value === null || this.searchers.product_model.value === '' || this.searchers.product_model.value.length < 2))
      return false;

    return true;

  }



  clearSearchFormHere(): void {
    this.router.navigate(['/dashboard/search/products']);
  }


  submitSearch(type: 'simple_search' | 'advanced_search'): void {

    const extras: NavigationExtras = {};
    extras.queryParams = {};
    if (type === 'simple_search')
      extras.queryParams = { product_code: this.searchers.product_number.value };
    else
      for (const field in this.searchers)
        if (this.searchers[field].label !== 'product_code')
          if (this.searchers[field].value !== null && this.searchers[field].value !== '')
            extras.queryParams[this.searchers[field].label] = this.searchers[field].value;


    this.router.navigate(['/dashboard/search/products'], extras);

  }





  async searchOrders(): Promise<void> {



    this.spinner.show();



    let query_params = '';
    for (const field in this.searchers)
      if (this.searchers[field].value !== null && this.searchers[field].value !== '')
        query_params += `&${this.searchers[field].label}=${this.searchers[field].value}`;

    query_params = query_params.replace(/^.{1}/g, '');

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

      this.spinner.hide();

      await this.utilsService.standardErrorHandling(error);
    }


    this.spinner.hide();



  }



}
