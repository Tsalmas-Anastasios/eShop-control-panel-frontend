import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from '../../../services/utils.service';
import { SeoService } from '../../../services/seo.service';
import { StorageService } from '../../../services/storage.service';
import { environment } from '../../../../environments/environment';
import {
  DataTableCustomModuleHeaders,
  DataTableCustomModuleOptions, ProductExtendLinks, SessionDataObject, StatusDropdownCustomModuleOptions,
  StatusDropdownCustomModuleStatusItem, UserPrivilegesSettings
} from '../../../models';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {

  public user: SessionDataObject;
  public columnHeaders: DataTableCustomModuleHeaders[] = [];
  public products_list: ProductExtendLinks[] = [];
  public products_status = 'all';
  public products_statuses = environment.params.arrays.products.statuses;
  public formatted_products_statuses: StatusDropdownCustomModuleStatusItem[] = environment.params.arrays.products.formatted_statuses;
  public productsTableOptions: DataTableCustomModuleOptions = environment.custom_dtTables;
  public status_dropdown_options: StatusDropdownCustomModuleOptions = environment.status_dropdown_options;
  public list_page = 1;

  public user_privileges: UserPrivilegesSettings;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private seo: SeoService,
    private storage: StorageService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.spinner.show();

    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.PRODUCTS_LIST.TAB_TITLE').toPromise() });

    this.user = this.storage.getItem('user');

    this.user_privileges = this.utilsService.getUsersPrivileges();


    const coin_symbol = this.user?.company_data?.coin_symbol || '€';
    this.columnHeaders = [
      { title: '#', field: 'id', auto_increment: true, identifier: false, width: '80px', text_align: 'center', header_text_align: 'header-center', header_text_fields_text_align: 'center' },
      { title: await this.translate.get('VIEWS.PRODUCTS_LIST.PRODUCT_ID').toPromise(), field: 'product_id', auto_increment: false, identifier: true, width: 'calc(calc(100% - 280px) / 4)' },
      { title: await this.translate.get('VIEWS.PRODUCTS_LIST.PRODUCT_CODE').toPromise(), field: 'product_code_link', auto_increment: false, identifier: false, width: 'calc(calc(100% - 280px) / 4)' },
      { title: await this.translate.get('VIEWS.PRODUCTS_LIST.PRODUCT').toPromise(), field: 'headline, product_brand, product_model', auto_increment: false, identifier: true, width: 'calc(calc(100% - 280px) / 4)' },
      { title: `${await this.translate.get('VIEWS.PRODUCTS_LIST.PRICE').toPromise()} (${coin_symbol})`, field: 'total_price', auto_increment: false, identifier: false, width: '120px', text_align: 'center' },
      { title: await this.translate.get('VIEWS.PRODUCTS_LIST.STOCK').toPromise(), field: 'stock', auto_increment: false, identifier: false, width: '80px', text_align: 'center' },
      { title: await this.translate.get('VIEWS.PRODUCTS_LIST.STATUS').toPromise(), field: 'current_status', auto_increment: false, identifier: false, width: 'calc(calc(100% - 280px) / 4)', specify_field: 'status_dropdown', header_text_fields_text_align: 'center' },
    ];


    await this.loadProductsData(false);






    this.spinner.hide();
  }





  async loadProductsData(ending: boolean, status_filter_change?: boolean): Promise<void> {

    // format the products array when change the status filter
    if (status_filter_change) {
      this.products_list = [];
      this.spinner.show();
    }


    try {

      let temp_products_list = [];
      if (this.products_status === 'all' || this.products_status === null || this.products_status === '')
        temp_products_list = await this.http.get<ProductExtendLinks[]>(`${environment.params.host}/api/ecommerce/store/products/specific-products?page=${this.list_page}`).toPromise();
      else
        temp_products_list = await this.http.get<ProductExtendLinks[]>(`${environment.params.host}/api/ecommerce/store/products/specific-products?current_status=${this.products_status}&page=${this.list_page}`).toPromise();



      // initialize list here
      this.initializeParsingProductsData(temp_products_list);


      if (ending)
        this.list_page++;



      if (status_filter_change)
        this.spinner.hide();

    } catch (error) {
      if (status_filter_change)
        this.spinner.hide();

      await this.utilsService.standardErrorHandling(error);
    }

  }





  initializeParsingProductsData(products: ProductExtendLinks[]): void {

    for (let i = 0; i < products.length; i++)
      this.products_list[i] = {
        ...products[i],
        product_code_link: {
          label: 'field product_code',
          run_function: this.quickActions_previewProduct,
          parameters: {
            product_id: 'product_id'
          },
          event: 'click',
        },
        total_price: products[i].clear_price + products[i].fees,
      };




    if (!environment.production)
      console.log(this.products_list);

    this.products_list = [...this.products_list];
  }





  public quickActions_previewProduct = async (parameters: { product_id: string }) => {
    window.open(`/dashboard/products/${parameters.product_id}`);
  }





  async productStatusChange(data: { identifier: string, new_status: 'in_stock' | 'available_1_to_3_days' | 'available_1_to_10_days' | 'available_1_to_30_days' | 'with_order' | 'unavailable' | 'temporary_unavailable' | 'out_of_stock' | 'ended' | 'closed' }): Promise<void> {


    try {

      let response;
      if (data.new_status !== 'closed')
        response = await this.http.put<any>(`${environment.params.host}/api/ecommerce/store/products/${data.identifier}/${data.new_status}`, null).toPromise();
      else
        response = await this.http.put<any>(`${environment.params.host}/api/ecommerce/store/products/${data.identifier}/archived`, null).toPromise();



      for (const product of this.products_list)
        if (product.product_id === data.identifier)
          product.current_status = data.new_status;


      this.products_list = [...this.products_list];

    } catch (error) {

      await this.utilsService.standardErrorHandling(error);

    }

  }


}
