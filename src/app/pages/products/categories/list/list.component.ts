import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { SeoService } from '../../../../services/seo.service';
import { StorageService } from '../../../../services/storage.service';
import { UtilsService } from './../../../../services/utils.service';
import {
  DataTableCustomModuleHeaders, ProductCategoryListItem, SessionDataObject,
  ProductCategory, DataTableCustomModuleOptions, UserPrivilegesSettings,
} from '../../../../models';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-product-categories-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public user: SessionDataObject;
  public columnHeaders: DataTableCustomModuleHeaders[] = [];
  public product_categories: ProductCategoryListItem[] = [];
  public product_category_modal: 'open' | 'closed' = 'closed';
  public product_category: ProductCategoryListItem;
  public productCategoriesTableOptions: DataTableCustomModuleOptions = environment.custom_dtTables;

  public user_privileges: UserPrivilegesSettings;





  constructor(
    private http: HttpClient,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private seo: SeoService,
    private storage: StorageService,
    private utilsService: UtilsService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.spinner.show();



    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.PRODUCT_CATEGORIES_LIST.TAB_TITLE').toPromise() });

    this.user = this.storage.getItem('user');

    this.user_privileges = this.utilsService.getUsersPrivileges();




    this.columnHeaders = [
      { title: '#', field: 'category_index', auto_increment: true, identifier: false, width: '80px', text_align: 'center', header_text_align: 'header-center', header_text_fields_text_align: 'center' },
      { title: await this.translate.get('VIEWS.PRODUCT_CATEGORIES_LIST.CATEGORY_ID').toPromise(), field: 'pcategory_id', auto_increment: false, identifier: true, width: 'calc(calc(100% - 280px) / 2)' },
      { title: await this.translate.get('VIEWS.PRODUCT_CATEGORIES_LIST.CATEGORY_LABEL').toPromise(), field: 'label_action', auto_increment: false, identifier: false, width: 'calc(calc(100% - 280px) / 2)' },
    ];

    if (this.user_privileges?.product_categories_edit)
      this.columnHeaders.push(
        { title: '', field: 'quick_action__edit', auto_increment: false, identifier: false, width: '60px', text_align: 'center', header_text_align: 'header-center', header_text_fields_text_align: 'center' },
        { title: '', field: 'quick_action__delete', auto_increment: false, identifier: false, width: '60px', text_align: 'center', header_text_align: 'header-center', header_text_fields_text_align: 'center' },
      );





    // take the list of product categories here
    try {

      const product_categories_temp: ProductCategory[] = await this.http.get<ProductCategory[]>(`${environment.params.host}/api/ecommerce/store/products/categories/list`).toPromise();



      if (!environment.production)
        console.log(product_categories_temp);




      // initialize product categories for the table
      this.initializeFormattedProductCategories(product_categories_temp);


    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }




    this.spinner.hide();

  }


  initializeFormattedProductCategories(product_categories: ProductCategoryListItem[] | ProductCategory[]): void {

    for (let i = 0; i < product_categories.length; i++) {
      const product_category = {
        ...product_categories[i],
        label_action: {
          label: 'field label',
          run_function: this.edit_product_category_modal_open,
          parameters: {
            pcategory_id: 'pcategory_id'
          },
          event: 'click'
        },
      };


      if (this.user_privileges?.product_categories_edit) {
        product_category['quick_action__edit'] = {
          label: '<i class="fas fa-edit"></i>',
          run_function: this.edit_product_category_modal_open,
          parameters: {
            pcategory_id: 'pcategory_id'
          },
          event: 'click',
          letters_color: '#229D18',
        };

        product_category['quick_action__delete'] = {
          label: '<i class="fas fa-trash"></i>',
          run_function: this.delete_product_category_quick_action,
          parameters: {
            pcategory_id: 'pcategory_id',
          },
          event: 'click',
          letters_color: '#cc0000'
        };
      }


      this.product_categories.push(product_category);
    }



    this.product_categories = [...this.product_categories];




    if (!environment.production)
      console.log(this.product_categories);

  }





  // quick actions function - edit
  public edit_product_category_modal_open = (parameters: { pcategory_id: string }) => {
    // this.product_category = { ...this.product_categories[parameters.pcategory_id] };
    for (const category of this.product_categories)
      if (category.pcategory_id === parameters.pcategory_id) {
        this.product_category = { ...category };
        break;
      }

    this.product_category_modal = 'open';
  }

  // quick actions function - delete
  public delete_product_category_quick_action = async (parameters: { pcategory_id: string }) => {

    let category_label: string;
    let index = -1;
    for (const category of this.product_categories) {
      index++;
      if (category.pcategory_id === parameters.pcategory_id) {
        category_label = category.label;
        break;
      }
    }



    this.utilsService.swal.fire({
      title: await this.translate.get('VIEWS.PRODUCT_CATEGORIES_LIST.ALERTS.PRODUCT_CATEGORY_DELETION').toPromise(),
      html: await this.translate.get('VIEWS.PRODUCT_CATEGORIES_LIST.ALERTS.ARE_YOU_SURE_YOU_WANT_TO_DELETE', { category_label: category_label }).toPromise(),
      showCancelButton: true,
      confirmButtonText: await this.translate.get('GENERIC.ACTIONS.DELETE').toPromise(),
      cancelButtonText: await this.translate.get('GENERIC.ACTIONS.CANCEL').toPromise(),
      confirmButtonColor: '#cc0000'
    }).then(async (result) => {
      if (result.isDismissed)
        return;


      this.spinner.show();


      // delete record
      try {

        const response = await this.http.delete<any>(`${environment.params.host}/api/ecommerce/store/products/c/categories/${parameters.pcategory_id}`).toPromise();

        this.product_categories.splice(index, 1);
        this.product_categories = [...this.product_categories];


        this.utilsService.showToast({
          message: await this.translate.get('VIEWS.PRODUCT_CATEGORIES_LIST.ALERTS.PRODUCT_CATEGORY_SUCCESSFULLY_REMOVED').toPromise(),
          type: 'success',
        });

      } catch (error) {
        this.spinner.hide();

        await this.utilsService.standardErrorHandling(error);

      }


      this.spinner.hide();

    });


  }




  // close edit modal
  closeModal(): void {
    this.product_category_modal = 'closed';
    this.product_category = null;
  }





  // edit categories label
  async submitEditForm(new_label: string): Promise<void> {

    this.product_category_modal = 'closed';



    try {

      const response = await this.http.put<any>(`${environment.params.host}/api/ecommerce/store/products/c/categories/${this.product_category.pcategory_id}`, { label: new_label }).toPromise();


      for (let i = 0; i < this.product_categories.length; i++)
        if (this.product_categories[i].pcategory_id === this.product_category.pcategory_id) {
          this.product_categories[i].label = new_label;
          break;
        }


      this.product_categories = [...this.product_categories];


      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.PRODUCT_CATEGORIES_LIST.ALERTS.CATEGORY_LABEL_UPDATED_SUCCESSFULLY').toPromise(),
        type: 'success'
      });

    } catch (error) {

      if (error?.error?.code === 400) {
        this.utilsService.showToast({
          message: await this.translate.get('VIEWS.PRODUCT_CATEGORIES_LIST.ALERTS.LABEL_CATEGORY_ALREADY_EXISTS').toPromise(),
          type: 'warning'
        });

        return;
      }



      await this.utilsService.standardErrorHandling(error);

    }

  }


}
