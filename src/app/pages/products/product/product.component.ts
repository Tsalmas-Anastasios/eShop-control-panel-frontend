import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SeoService } from '../../../services/seo.service';
import { StorageService } from '../../../services/storage.service';
import { UtilsService } from '../../../services/utils.service';
import {
  CompanyWarehouse,
  Product, ProductCategory, ProductStock, ProductTransaction, SessionDataObject, StatusDropdownCustomModuleOptions,
  StatusDropdownCustomModuleStatusItem,
  UserPrivilegesSettings
} from '../../../models';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  public mode: 'preview' | 'edit' | 'new';
  public product_id: string;
  public product: Product;
  public product_categories_list: ProductCategory[];

  public user: SessionDataObject;
  public user_privileges: UserPrivilegesSettings;

  public warehouses: CompanyWarehouse[];

  public product_statuses = environment.params.arrays.products.statuses;
  public formatted_product_statuses: StatusDropdownCustomModuleStatusItem[] = environment.params.arrays.products.formatted_statuses;
  public status_dropdown_options: StatusDropdownCustomModuleOptions = environment.status_dropdown_options;

  public productImagesFiles: File[] = [];
  public product_main_image_index: number;

  public imageMaxFileSize = environment.params.imagesMaxFileSize;

  public product_categories: string[][] = [];

  public isSavingProductData = false;
  public isUpdating = false;

  public deleted_images_from_edit: string[] = [];

  public notes_updating_procedure_description: 'saved' | 'updating' | 'error' | 'nothing' = 'nothing';

  public productTransactions: ProductTransaction[] = [];
  public product_transactions_page = 1;




  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private seo: SeoService,
    private storageService: StorageService,
  ) {


    // when the lik parameter is changed



  }




  ngOnInit(): void {

    this.user_privileges = this.utilsService.getUsersPrivileges();

    this.route.params.subscribe(async (params) => {

      if (params.product_id === 'new') {
        this.mode = 'new';

        if (!this.user_privileges?.products_new)
          this.router.navigate(['/']);
      } else {
        this.product_id = params.product_id;

        this.route.queryParams.subscribe((queryParams) => {
          if (queryParams?.mode)
            if (queryParams.mode === 'edit' || queryParams.mode === 'preview')
              this.mode = queryParams.mode;
            else
              this.mode = 'preview';
          else
            this.mode = 'preview';
        });


        if (!this.user_privileges?.products_edit)
          this.mode = 'preview';

        if (!this.user_privileges?.products_edit && !this.user_privileges?.products_read)
          this.router.navigate(['/']);
      }



      this.spinner.show();



      this.user = this.storageService.getItem('user');


      if (this.mode === 'new')
        this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.PRODUCT_PAGE.NEW_PRODUCT').toPromise() });
      else
        this.seo.updatePageMetadata({ title: `${await this.translate.get('GENERIC.LABELS.PRODUCT').toPromise()} ${this.product_id}` });



      // all product data
      try {

        Promise.all([
          this.product_categories_list = await this.http.get<ProductCategory[]>(`${environment.params.host}/api/ecommerce/store/products/categories/list`).toPromise(),
          this.warehouses = await this.http.get<CompanyWarehouse[]>(`${environment.params.host}/api/settings/company-data/warehouses`).toPromise()
        ]);

      } catch (error) {
        this.spinner.hide();
        await this.utilsService.standardErrorHandling(error);
      }









      if (this.mode === 'new') {
        this.product = new Product();
        this.product.product_stock.push(new ProductStock());
        this.product.current_status = 'in_stock';
      } else
        await this.fetchProductData();

      this.spinner.hide();

    });

  }





  // update data
  onUpdateProductData(product: Product): void {
    this.product = { ...product };
  }

  onUpdateProductImages(product_images: File[]): void {
    this.productImagesFiles = [...product_images];
  }

  onUpdateProductMainImage(index: number): void {
    this.product_main_image_index = index;
  }

  onUpdateProductCategories(product_categories: string[][]): void {
    this.product_categories = [...product_categories];
  }






  // form's required fields
  async checkRequiredFields(): Promise<boolean> {

    if (this.mode === 'new')
      if (this.product_categories.length <= 0) {
        this.utilsService.showToast({
          message: await this.translate.get('VIEWS.PRODUCT_PAGE.ALERTS.PLEASE_SELECT_PRODUCT_CATEGORIES_FIRST').toPromise(),
          type: 'error'
        });

        return false;
      }



    // product images
    if (this.mode === 'new') {
      if (this.productImagesFiles.length <= 0) {
        this.utilsService.showToast({
          message: await this.translate.get('VIEWS.PRODUCT_PAGE.ALERTS.PLEASE_ADD_PRODUCT_PHOTOS').toPromise(),
          type: 'error',
        });

        return false;
      }
    } else
      if (this.product.images.length <= 0) {
        this.utilsService.showToast({
          message: await this.translate.get('VIEWS.PRODUCT_PAGE.ALERTS.PLEASE_ADD_PRODUCT_PHOTOS').toPromise(),
          type: 'error',
        });

        return false;
      }



    // product specification
    if (this.product.specification.length > 0) {
      for (let i = 0; i <= this.product.specification.length; i++)
        if (this.product?.specification[i])
          if (this.product.specification[i].category_name === '' || this.product.specification[i].category_name === null
            || !this.product.specification[i]?.fields || this.product.specification[i].fields.length <= 0
            || this.utilsService.lodash.isEmpty(this.product.specification[i].fields)) {
            this.utilsService.showToast({
              message: await this.translate.get('VIEWS.PRODUCT_PAGE.ALERTS.PLEASE_FILL_OUT_ALL_THE_FIELDS_FROM_SPECIFICATION').toPromise(),
              type: 'error'
            });

            return false;
          } else {

            for (let j = 0; j <= this.product.specification[i].fields.length; j++)
              if (this.product.specification[i]?.fields[j])
                if (this.product.specification[i].fields[j].specification_field_name === '' || this.product.specification[i].fields[j].specification_field_name === null
                  || this.product.specification[i].fields[j].specification_field_value === '' || this.product.specification[i].fields[j].specification_field_value === null) {
                  this.utilsService.showToast({
                    message: await this.translate.get('VIEWS.PRODUCT_PAGE.ALERTS.PLEASE_FILL_OUT_ALL_THE_FIELDS_FROM_SPECIFICATION').toPromise(),
                    type: 'error'
                  });

                  return false;
                }

          }
    } else {
      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.PRODUCT_PAGE.ALERTS.PLEASE_CREATE_A_FULL_SPECIFICATION_FOR_THE_PRODUCT').toPromise(),
        type: 'error'
      });

      return false;
    }




    return true;

  }






  // add new product
  async saveNewProduct(): Promise<void> {

    this.isSavingProductData = true;



    if (!this.checkRequiredFields())
      return;



    // make the categories object
    this.product.categories_belongs = {};
    for (let i = 0; i < this.product_categories.length; i++)
      this.product.categories_belongs[this.product_categories[i][0]] = this.product_categories[i][1];

    this.product.categories_belongs = JSON.stringify(this.product.categories_belongs);



    // product fees
    this.product.fee_percent = this.user?.company_data?.fee_percent || 0;
    if (this.product.fee_percent > 0)
      this.product.fees = this.product.clear_price * this.product.fee_percent / 100;




    try {


      const response = await this.http.post<any>(`${environment.params.host}/api/ecommerce/store/products/new`, this.product).toPromise();



      const reqHeaders: HttpHeaders = new HttpHeaders();
      reqHeaders.append('Content-Type', 'multipart/form-data');
      const formData = new FormData();

      for (let i = 0; i < this.productImagesFiles.length; i++)
        formData.append('product_image', this.productImagesFiles[i], this.productImagesFiles[i].name);



      const images_response = await this.http.post<any>(`${environment.params.host}/api/ecommerce/store/products/${response.product_id}/upload-multiple-image`, formData, { headers: reqHeaders }).toPromise();





      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.PRODUCT_PAGE.ALERTS.PRODUCT_SAVED').toPromise(),
        html: await this.translate.get('VIEWS.PRODUCT_PAGE.ALERTS.PRODUCT_SAVED_SUCCESSFULLY').toPromise(),
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
      }).then((result) => {
        this.router.navigate([`/dashboard/products/${response.product_id}`]);
      });

    } catch (error) {
      this.spinner.hide();
      await this.utilsService.standardErrorHandling(error);
    }





    this.isSavingProductData = false;

  }





  // get data for existing product
  async fetchProductData(): Promise<void> {

    try {


      this.product = await this.http.get<Product>(`${environment.params.host}/api/ecommerce/store/products/${this.product_id}`).toPromise();
      this.product.categories_belongs = JSON.parse(this.product.categories_belongs);
      // this.product_categories = Object.entries(this.product.categories_belongs);




      if (!environment.production)
        console.log(this.product);

    } catch (error) {
      this.spinner.hide();


      if (error?.status && error.status === 404) {
        this.utilsService.swal.fire({
          title: await this.translate.get('VIEWS.PRODUCT_PAGE.ALERTS.PRODUCT_NOT_FOUND').toPromise(),
          html: await this.translate.get('VIEWS.PRODUCT_PAGE.ALERTS.PRODUCT_NOT_FOUND_TEXT').toPromise(),
          showConfirmButton: false,
          timer: 4000,
          icon: 'error'
        }).then(() => this.router.navigate(['/dashboard/products']));



        return Promise.resolve();
      }

      await this.utilsService.standardErrorHandling(error);
    }

  }




  // change product status
  async onProductStatusChange(new_status:
    'in_stock'
    | 'available_1_to_3_days'
    | 'available_1_to_10_days'
    | 'available_1_to_30_days'
    | 'with_order'
    | 'unavailable'
    | 'temporary_unavailable'
    | 'out_of_stock'
    | 'ended'
    | 'closed'
  ): Promise<void> {

    try {

      let response;
      if (new_status !== 'closed')
        response = await this.http.put<any>(`${environment.params.host}/api/ecommerce/store/products/${this.product.product_id}/${new_status}`, null).toPromise();
      else
        response = await this.http.put<any>(`${environment.params.host}/api/ecommerce/store/products/${this.product.product_id}/archived`, null).toPromise();


      this.product.current_status = new_status;
      this.product = { ...this.product };


      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.PRODUCT_PAGE.ALERTS.PRODUCT_STATUS_UPDATED_SUCCESSFULLY').toPromise(),
        type: 'success',
      });

    } catch (error) {

      await this.utilsService.standardErrorHandling(error);

    }

  }




  // update notes for product
  async onProductNotesChange(notes: string): Promise<void> {

    this.notes_updating_procedure_description = 'updating';

    try {

      const response = await this.http.put<any>(`${environment.params.host}/api/ecommerce/store/products/${this.product.product_id}/notes/update`, { notes: notes }).toPromise();

      this.notes_updating_procedure_description = 'saved';

      this.product.notes = notes;

    } catch (error) {

      this.notes_updating_procedure_description = 'error';

      await this.utilsService.standardErrorHandling(error);

    }

  }



  // change the product page view
  onToggleProductPageMode(mode: 'preview' | 'edit'): void {
    this.mode = mode;
  }



  // auto updating the product categories
  async onProductCategoriesUpdate(product_categories: string[][]): Promise<void> {

    if (product_categories.length <= 0) {
      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.PRODUCT_PAGE.ALERTS.THE_PRODUCT_CANNOT_HAVE_NO_CATEGORIES').toPromise(),
        type: 'warning',
      });

      return;
    }




    const product_categories_obj = {};
    for (let i = 0; i < product_categories.length; i++)
      product_categories_obj[product_categories[i][0]] = product_categories[i][1];




    const categories = JSON.stringify(product_categories_obj);


    try {

      const response = await this.http.put<any>(`${environment.params.host}/api/ecommerce/store/${this.product.product_id}/categories/update`, { categories: categories }).toPromise();


      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.PRODUCT_PAGE.ALERTS.PRODUCT_CATEGORIES_SUCCESSFULLY_UPDATED').toPromise(),
        type: 'success'
      });

    } catch (error) {

      await this.utilsService.standardErrorHandling(error);

    }


  }




  // update product function
  async updateProduct(): Promise<void> {

    this.isUpdating = true;



    if (!this.checkRequiredFields())
      return;




    // product fees - calculate them
    this.product.fee_percent = this.user?.company_data?.fee_percent || 0;
    if (this.product.fee_percent > 0)
      this.product.fees = this.product.clear_price * this.product.fee_percent / 100;



    try {

      this.product.categories_belongs = JSON.stringify(this.product.categories_belongs);
      const response = await this.http.put<any>(`${environment.params.host}/api/ecommerce/store/products/${this.product_id}`, this.product).toPromise();



      // save new images

      if (this.productImagesFiles.length > 0) {

        let queryParams = '';
        if (this.product_main_image_index > -1)
          queryParams = `?main_image=${this.product_main_image_index}`;


        const reqHeaders: HttpHeaders = new HttpHeaders();
        reqHeaders.append('Content-Type', 'multipart/form-data');
        const formData = new FormData();

        for (let i = 0; i < this.productImagesFiles.length; i++)
          formData.append('product_image', this.productImagesFiles[i], this.productImagesFiles[i].name);


        const images_response = await this.http.post<any>(`${environment.params.host}/api/ecommerce/store/products/${this.product_id}/upload-multiple-image`, formData, { headers: reqHeaders }).toPromise();

      }



      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.PRODUCT_PAGE.ALERTS.PRODUCT_SAVED').toPromise(),
        html: await this.translate.get('VIEWS.PRODUCT_PAGE.ALERTS.PRODUCT_SAVED_SUCCESSFULLY').toPromise(),
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
      }).then((result) => {
        // this.router.navigate([`/dashboard/products/${this.product_id}`]);
        window.location.reload();
      });


    } catch (error) {

      this.spinner.hide();
      await this.utilsService.standardErrorHandling(error);

    }



    this.isUpdating = false;

  }




  // generate the link and make it shared
  async makeProductShared(): Promise<void> {





  }




}
