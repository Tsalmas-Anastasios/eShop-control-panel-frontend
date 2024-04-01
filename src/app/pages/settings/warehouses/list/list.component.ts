import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from '../../../../services/utils.service';
import { SeoService } from '../../../../services/seo.service';
import { StorageService } from '../../../../services/storage.service';
import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CompanyWarehouse, DataTableCustomModuleHeaders, SessionDataObject, UserPrivilegesSettings,
  CompanyWarehouseListingObject, DataTableCustomModuleOptions
} from '../../../../models';

@Component({
  selector: 'app-settings-warehouses-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  private tmp_warehouses: CompanyWarehouse[];
  public warehouses: CompanyWarehouseListingObject[];
  public user: SessionDataObject;

  public warehouseDtTableOptions: DataTableCustomModuleOptions = environment.custom_dtTables;
  public columnHeaders: DataTableCustomModuleHeaders[] = [];

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



    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.TAB_TITLE').toPromise() });

    this.user = this.storage.getItem('user');

    this.user_privileges = this.utilsService.getUsersPrivileges();



    // set the headers columns for the dtTable
    this.columnHeaders = [
      { title: '#', field: 'id', auto_increment: true, identifier: false, width: '80px', text_align: 'center', header_text_align: 'header-center', header_text_fields_text_align: 'center' },
      { title: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.WAREHOUSE_ID').toPromise(), field: 'warehouse_id', auto_increment: false, identifier: true, width: 'calc(calc(100% - 300px) / 5)' },
      { title: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.DISTINCTIVE_TITLE').toPromise(), field: 'distinctive_title_link', auto_increment: false, identifier: false, width: 'calc(calc(100% - 300px) / 5)' },
      { title: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.CODE_NAME').toPromise(), field: 'code_name', auto_increment: false, identifier: false, width: 'calc(calc(100% - 300px) / 5)' },
      { title: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.CONTACT_PHONE').toPromise(), field: 'contact__phone', auto_increment: false, identifier: false, width: 'calc(calc(100% - 300px) / 5)' },
      { title: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.WAREHOUSE_MANAGER').toPromise(), field: 'warehouse_manager__fullname', auto_increment: false, identifier: false, width: 'calc(calc(100% - 300px) / 5)' },
      { title: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.RUNWAYS').toPromise(), field: 'runways_counter', auto_increment: false, identifier: false, width: '100px', header_text_fields_text_align: 'center' },
      { title: '', field: 'quick_actions__preview', auto_increment: false, identifier: false, width: '40px', header_text_fields_text_align: 'center' },
    ];



    if (this.user_privileges.warehouses_edit)
      this.columnHeaders.push(
        { title: '', field: 'quick_actions__edit', auto_increment: false, identifier: false, width: '40px', header_text_fields_text_align: 'center' },
        { title: '', field: 'quick_actions__delete', auto_increment: false, identifier: false, width: '40px', header_text_fields_text_align: 'center' }
      );




    // fetch warehouses here
    try {

      this.tmp_warehouses = await this.http.get<CompanyWarehouse[]>(`${environment.params.host}/api/settings/company-data/warehouses`).toPromise();
      this.initializeWarehousesData();

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }



    this.spinner.hide();

  }





  initializeWarehousesData(): void {

    this.warehouses = [];



    for (const warehouse of this.tmp_warehouses) {

      const new_warehouse: CompanyWarehouseListingObject = {
        ...warehouse,
        distinctive_title_link: {
          label: 'field distinctive_title',
          run_function: this.quick_actions__preview_warehouse,
          parameters: { warehouse_id: 'warehouse_id' },
          event: 'click',
        },
        runways_counter: warehouse.runways.length,
        quick_actions__preview: {
          label: '<i class="fas fa-eye"></i>',
          run_function: this.quick_actions__preview_warehouse,
          parameters: { warehouse_id: 'warehouse_id' },
          event: 'click',
          letters_color: '#506FDE'
        }
      };


      if (this.user_privileges.warehouses_edit) {
        new_warehouse.quick_actions__edit = {
          label: '<i class="fas fa-edit"></i>',
          run_function: this.quick_actions__edit,
          parameters: { warehouse_id: 'warehouse_id' },
          event: 'click',
          letters_color: '#00cc00'
        };

        new_warehouse.quick_actions__delete = {
          label: '<i class="fas fa-trash"></i>',
          run_function: this.quick_actions__delete,
          parameters: { warehouse_id: 'warehouse_id' },
          event: 'click',
          letters_color: '#cc0000',
        };
      }


      this.warehouses.push(new_warehouse);

    }

    this.warehouses = [...this.warehouses];

  }






  public quick_actions__preview_warehouse = (parameters: { warehouse_id: string }) => {
    this.router.navigate([`/settings/warehouses/${parameters.warehouse_id}`]);
  }

  public quick_actions__edit = (parameters: { warehouse_id: string }) => {
    this.router.navigate([`/settings/warehouses/${parameters.warehouse_id}`], { queryParams: { mode: 'edit' } });
  }

  public quick_actions__delete = async (parameters: { warehouse_id: string }) => {

    this.utilsService.swal.fire({
      title: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.ALERTS.DELETE_WAREHOUSE').toPromise(),
      html: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.ALERTS.SURE_DELETE_WAREHOUSE', { warehouse_id: parameters.warehouse_id }).toPromise(),
      showCancelButton: true,
      confirmButtonText: await this.translate.get('GENERIC.ACTIONS.DELETE').toPromise(),
      cancelButtonText: await this.translate.get('GENERIC.ACTIONS.CANCEL').toPromise(),
      confirmButtonColor: '#cc0000',
    }).then(async (result) => {

      if (result.isDismissed)
        return Promise.resolve();


      this.spinner.show();



      try {

        const response = await this.http.delete<any>(`${environment.params.host}/api/settings/company-data/warehouses/${parameters.warehouse_id}`).toPromise();


        let index = -1;
        for (const warehouse of this.warehouses) {
          index++;
          if (warehouse.warehouse_id === parameters.warehouse_id)
            break;
        }

        this.warehouses.splice(index, 1);

        this.warehouses = [...this.warehouses];


        this.utilsService.swal.fire({
          title: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.ALERTS.WAREHOUSE_DELETED').toPromise(),
          html: await this.translate.get('VIEWS.SETTINGS.WAREHOUSES.ALERTS.WAREHOUSE_DELETED_SUCCESSFULLY').toPromise(),
          icon: 'success',
          showConfirmButton: false,
          timer: 3000
        });

      } catch (error) {
        this.spinner.hide();
        await this.utilsService.standardErrorHandling(error);
      }



      this.spinner.hide();

    });


  }


}
