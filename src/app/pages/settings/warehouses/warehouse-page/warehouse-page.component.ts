import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from '../../../../services/utils.service';
import { SeoService } from '../../../../services/seo.service';
import { StorageService } from '../../../../services/storage.service';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyWarehouse, CompanyWarehouseRunway, SessionDataObject, UserPrivilegesSettings } from '../../../../models';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-warehouse-page',
  templateUrl: './warehouse-page.component.html',
  styleUrls: ['./warehouse-page.component.scss']
})
export class WarehousePageComponent implements OnInit {

  public mode: 'preview' | 'edit' | 'new';
  public warehouse_id: string;
  public warehouse: CompanyWarehouse;

  public user: SessionDataObject;
  public user_privileges: UserPrivilegesSettings;

  public isSaving = false;


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

  ngOnInit(): void {

    this.user_privileges = this.utilsService.getUsersPrivileges();

    this.route.params.subscribe(async (params) => {

      if (params.warehouse_id === 'new') {
        this.mode = 'new';

        if (!this.user_privileges?.warehouses_new)
          this.router.navigate(['/settings']);

      } else {
        this.warehouse_id = params.warehouse_id;

        this.route.queryParams.subscribe((queryParams) => {
          if (queryParams?.mode)
            if (queryParams.mode === 'edit' || queryParams.mode === 'preview')
              this.mode = queryParams.mode;
            else
              this.mode = 'preview';
          else
            this.mode = 'preview';
        });


        if (!this.user_privileges?.warehouses_edit)
          this.mode = 'preview';

        if (!this.user_privileges?.warehouses_edit && !this.user_privileges?.warehouses_read)
          this.router.navigate(['/settings']);
      }



      this.spinner.show();



      this.user = this.storage.getItem('user');

      if (this.mode === 'new')
        this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.WAREHOUSE_PAGE.TAB_TITLE_NEW').toPromise() });
      else
        this.seo.updatePageMetadata({ title: `${await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.WAREHOUSE_PAGE.TAB_TITLE').toPromise()} ${this.warehouse_id}` });



      // fetch here anything




      if (this.mode === 'new')
        this.warehouse = new CompanyWarehouse();
      else
        await this.getWarehouseData();


      this.spinner.hide();

    });

  }


  onUpdateWarehouseData(warehouse: CompanyWarehouse): void {
    this.warehouse = { ...warehouse };
  }



  checkRequiredData(): boolean {

    for (const runway of this.warehouse.runways) {

      if (runway.runway_name === ''
        || runway.runway_name === null
        || runway.runway_code === ''
        || runway.runway_code === null
        || runway.columns.length < 1)
        return false;


      for (const column of runway.columns) {

        if (column.column_code === '' || column.column_code === null
          || column.column_name === '' || column.column_name === null
          || column.shelf.length < 1)
          return false;


        for (const shelf of column.shelf)
          if (shelf.shelf_code === '' || shelf.shelf_code === null)
            return false;

      }

    }


    return true;

  }




  // save new warehouse
  async saveNewWarehouse(): Promise<void> {

    this.isSaving = true;


    try {

      const response = await this.http.post<any>(`${environment.params.host}/api/settings/company-data/warehouses/w/add`, { warehouse: this.warehouse }).toPromise();


      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.WAREHOUSE_PAGE.ALERTS.NEW_WAREHOUSE_SAVED').toPromise(),
        html: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.WAREHOUSE_PAGE.ALERTS.NEW_WAREHOUSE_SAVED_MESSAGE').toPromise(),
        icon: 'success',
        showConfirmButton: false,
        timer: 3000
      }).then((result) => this.router.navigate([`/settings/warehouses/${response.warehouse_id}`]));

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }


    this.isSaving = false;

  }



  // get the warehouse's data
  async getWarehouseData(): Promise<void> {

    try {

      this.warehouse = await this.http.get<CompanyWarehouse>(`${environment.params.host}/api/settings/company-data/warehouses/${this.warehouse_id}`).toPromise();

      if (!environment.production)
        console.log(this.warehouse);

    } catch (error) {

      if (error?.status && error.status === 404) {
        this.utilsService.swal.fire({
          title: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.WAREHOUSE_PAGE.ALERTS.WAREHOUSE_NOT_FOUND').toPromise(),
          html: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.WAREHOUSE_PAGE.ALERTS.WAREHOUSE_NOT_FOUND_TEXT').toPromise(),
          showConfirmButton: false,
          timer: 4000,
          icon: 'error'
        }).then(() => this.router.navigate(['/settings/warehouses']));



        return Promise.resolve();
      }

      this.utilsService.standardErrorHandling(error);
    }

  }



  // toggle the mode of modifying and processing the warehouse
  toggleModeProcessingWarehouse(mode: 'edit' | 'preview'): void {
    this.mode = mode;
  }




  // add new runway from the warehouse
  async saveNewWarehouseRunway(runway: CompanyWarehouseRunway): Promise<void> {


    try {

      const response = await this.http.post<any>(`${environment.params.host}/api/settings/company-data/warehouses/${this.warehouse_id}/runways/r/new?save_columns=true`, { runway: runway }).toPromise();
      runway.runway_id = response.runway_id;


      this.warehouse.runways.push(runway);
      this.warehouse = { ...this.warehouse };


      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.WAREHOUSE_PAGE.MESSAGES.NEW_RUNWAY_SAVED_SUCCESSFULLY').toPromise(),
        type: 'success'
      });

    } catch (error) {
      this.utilsService.standardErrorHandling(error);

      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.WAREHOUSE_PAGE.MESSAGES.YOUR_WORK_DID_NOT_BEEN_SAVED').toPromise(),
        type: 'error',
      });
    }


  }


  // remove a specific runway
  async removeRunway(runway_id: string): Promise<void> {

    this.utilsService.swal.fire({
      title: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.WAREHOUSE_PAGE.ALERTS.DELETE_WAREHOUSE_RUNWAY_TITLE').toPromise(),
      html: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.WAREHOUSE_PAGE.ALERTS.DELETE_WAREHOUSE_RUNWAY_TITLE_MESSAGE').toPromise(),
      showCancelButton: true,
      confirmButtonText: await this.translate.get('GENERIC.ACTIONS.DELETE').toPromise(),
      confirmButtonColor: '#cc0000',
    }).then(async (result) => {
      if (result.isDismissed)
        return;


      // delete runway
      try {

        const response = await this.http.delete<any>(`${environment.params.host}/api/settings/company-data/warehouses/${this.warehouse_id}/runways/${runway_id}`).toPromise();

        let index = 0;
        for (let i = 0; i < this.warehouse.runways.length; i++)
          if (this.warehouse.runways[i].runway_id === runway_id) {
            index = i;
            break;
          }

        this.warehouse.runways.splice(index, 1);
        this.warehouse = { ...this.warehouse };



        this.utilsService.showToast({
          message: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.WAREHOUSE_PAGE.MESSAGES.RUNWAY_DELETED_SUCCESSFULLY').toPromise(),
          type: 'success'
        });

      } catch (error) {
        this.utilsService.standardErrorHandling(error);
      }

    });

  }



  // update the warehouse's data
  async updateWarehouseData(): Promise<void> {

    this.isSaving = true;


    try {

      const response = await this.http.put<any>(`${environment.params.host}/api/settings/company-data/warehouses/${this.warehouse_id}`, { warehouse: this.warehouse }).toPromise();



      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.WAREHOUSE_PAGE.ALERTS.WAREHOUSE_UPDATED').toPromise(),
        html: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.WAREHOUSE_PAGE.ALERTS.WAREHOUSE_UPDATED_SUCCESSFULLY').toPromise(),
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
      });

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }


    this.isSaving = false;

  }


}
