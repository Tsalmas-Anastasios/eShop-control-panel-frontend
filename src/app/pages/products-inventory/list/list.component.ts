import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SeoService } from '../../../services/seo.service';
import { StorageService } from '../../../services/storage.service';
import { UtilsService } from '../../../services/utils.service';
import { environment } from '../../../../environments/environment';
import {
  DataTableCustomModuleHeaders, DataTableCustomModuleOptions, ProductInventoryMainData, SessionDataObject,
  ProductInventoryMainDataDtOptions
} from '../../../models';

@Component({
  selector: 'app-products-inventory-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public user: SessionDataObject;
  public columnHeaders: DataTableCustomModuleHeaders[] = [];
  public productsInventoriesTableOptions: DataTableCustomModuleOptions = environment.custom_dtTables;
  public product_inventories: ProductInventoryMainDataDtOptions[] = [];
  private list_page = 1;
  private can_extend = false;
  public inventory: ProductInventoryMainData;
  public inventory_descriptive_title: string;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    public utilsService: UtilsService,
    private seo: SeoService,
    private storage: StorageService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.PRODUCTS_INVENTORIES.TAB_TITLE').toPromise() });


    this.columnHeaders = [
      { title: '#', field: 'id', auto_increment: true, identifier: false, width: '80px', text_align: 'center', header_text_align: 'header-center', header_text_fields_text_align: 'center' },
      { title: await this.translate.get('VIEWS.PRODUCTS_INVENTORIES.INVENTORY_ID').toPromise(), field: 'inventory_id', auto_increment: false, identifier: true, width: 'calc(calc(100% - 200px) / 4)' },
      { title: await this.translate.get('VIEWS.PRODUCTS_INVENTORIES.DESCRIPTIVE_TITLE').toPromise(), field: 'descriptive_title', auto_increment: false, identifier: false, width: 'calc(calc(100% - 200px) / 4)' },
      { title: await this.translate.get('VIEWS.PRODUCTS_INVENTORIES.CREATED_AT').toPromise(), field: 'created_at', auto_increment: false, identifier: false, width: 'calc(calc(100% - 200px) / 4)', text_align: 'center', header_text_align: 'header-center', header_text_fields_text_align: 'center' },
      { title: await this.translate.get('VIEWS.PRODUCTS_INVENTORIES.CREATED_BY').toPromise(), field: 'created_by__full_name', auto_increment: false, identifier: false, width: 'calc(calc(100% - 200px) / 4)' },
      { title: '', field: 'view_pdf', auto_increment: false, identifier: false, width: '120px', text_align: 'center', header_text_align: 'header-center', header_text_fields_text_align: 'center' },
    ];




    await this.getProductsInventory('initialize');

  }






  async getProductsInventory(mode: 'initialize' | 'extend', ending?: boolean): Promise<void> {

    this.spinner.show();


    if (mode === 'initialize') {
      this.list_page = 1;
      this.product_inventories = [];
    } else
      this.list_page++;



    try {

      const tmp_inv: ProductInventoryMainData[] = await this.http.get<ProductInventoryMainData[]>(`${environment.params.host}/api/products/inventories-specific-data?page=${this.list_page}`).toPromise();

      // this.product_inventories = [...this.product_inventories, ...tmp_inv];
      this.product_inventories = [...this.product_inventories, ...this.initializeProductInventoryNewRecords(tmp_inv)];

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }


    this.spinner.hide();

  }




  initializeProductInventoryNewRecords(inventories: ProductInventoryMainData[]): ProductInventoryMainDataDtOptions[] {

    const new_inv: ProductInventoryMainDataDtOptions[] = [];

    for (const inventory of inventories)
      new_inv.push({
        ...inventory,
        created_at: this.utilsService.moment(Number(inventory.created_at) / 1).format('MM-DD-YYYY'),
        created_by__full_name: `${inventory.created_by__first_name} ${inventory.created_by__last_name}`,
        view_pdf: {
          label: '<i class="fas fa-file-pdf"></i> <span>PDF</span>',
          run_function: this.view_pdf,
          parameters: {
            inventory_id: 'inventory_id'
          },
          event: 'click',
        }
      });


    return new_inv;

  }


  public view_pdf = async (parameters: { inventory_id: string }) => {
    // console.log(parameters.inventory_id);


    this.spinner.show();


    let inventory: ProductInventoryMainData;
    try {

      inventory = await this.http.get<ProductInventoryMainData>(`${environment.params.host}/api/products/inventories/${parameters.inventory_id}`).toPromise();


      if (!environment.production)
        console.log(inventory);

      this.inventory = inventory;

    } catch (error) {
      this.utilsService.standardErrorHandling(error);

      this.spinner.hide();
      return Promise.resolve();
    }





    await this.createInventoryPdf();




    this.spinner.hide();

  }





  async createInventoryPdf(): Promise<void> {

    await this.utilsService.delay(100);
    // create pdf here |||
    const dimensions: {
      width: number;
      height: number;
    } = {
      width: 21,
      height: 29.7
    };

    const element = document.getElementById('inventoryDetailsReport');
    element.style.visibility = 'visible';


    const opt = {
      margin: 0.1,
      filename: 'output.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };

    this.utilsService.html2pdf().from(element).set(opt).save();


    await this.utilsService.delay(100);
    element.style.visibility = 'hidden';
    this.inventory = null;

  }



  async createNewInventory(): Promise<void> {

    this.utilsService.swal.fire({
      title: await this.translate.get('VIEWS.PRODUCTS_INVENTORIES.ALERTS.NEW_INVENTORY_START_TITLE').toPromise(),
      html: await this.translate.get('VIEWS.PRODUCTS_INVENTORIES.ALERTS.NEW_INVENTORY_START_TEXT').toPromise(),
      icon: 'success'
    });




    try {

      const response = await this.http.post<any>(`${environment.params.host}/api/products/inventories/n/new?send_email=1`, { descriptive_title: this.inventory_descriptive_title }).toPromise();

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }


  }


}
