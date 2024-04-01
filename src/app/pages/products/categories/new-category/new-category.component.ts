import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { SeoService } from '../../../../services/seo.service';
import { UtilsService } from './../../../../services/utils.service';
import { environment } from '../../../../../environments/environment';
import { ProductCategory, UserPrivilegesSettings } from '../../../../models';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-new-products-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss']
})
export class NewCategoryComponent implements OnInit {

  public product_category: ProductCategory = new ProductCategory();
  public user_privileges: UserPrivilegesSettings;

  constructor(
    private http: HttpClient,
    private router: Router,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private seo: SeoService,
    private utilsService: UtilsService,
  ) { }


  async ngOnInit(): Promise<void> {

    this.user_privileges = this.utilsService.getUsersPrivileges();

    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.NEW_PRODUCT_CATEGORY.TAB_TITLE').toPromise() });

  }




  async onSubmitForm(label: string): Promise<void> {

    this.spinner.show();


    try {

      const response = await this.http.post<any>(`${environment.params.host}/api/ecommerce/store/products/categories/new`, { label: label }).toPromise();


      this.router.navigate(['/dashboard/product-categories']);

    } catch (error) {

      this.spinner.hide();

      if (error?.error?.code === 400) {
        this.utilsService.showToast({
          message: await this.translate.get('VIEWS.PRODUCT_CATEGORIES_LIST.ALERTS.LABEL_CATEGORY_ALREADY_EXISTS').toPromise(),
          type: 'warning'
        });

        return Promise.reject();
      }



      await this.utilsService.standardErrorHandling(error);

    }



  }


}
