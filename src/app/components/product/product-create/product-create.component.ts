import {
  ChangeDetectionStrategy, Component, OnInit, Input, ViewChild, Output, EventEmitter,
  ChangeDetectorRef
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NbTagComponent } from '@nebular/theme';
import {
  CompanyWarehouse, CompanyWarehouseColumn, CompanyWarehouseColumnShelf, CompanyWarehouseRunway, Product, ProductCategory, ProductSpecificationCategory, ProductSpecificationField, ProductStock, SessionDataObject,
  StatusDropdownCustomModuleOptions, StatusDropdownCustomModuleStatusItem
} from '../../../models';
import { UtilsService } from '../../../services/utils.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorComponent, ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { ControlContainer, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';




@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class ProductCreateComponent implements OnInit {

  @Input() user: SessionDataObject;
  @Input() product: Product;
  @Input() product_categories_list: ProductCategory[];
  @Input() product_statuses: any;
  @Input() formatted_product_statuses: StatusDropdownCustomModuleStatusItem;
  @Input() status_dropdown_options: StatusDropdownCustomModuleOptions;
  @Input() productImages: File[];
  @Input() imageMaxFileSize: number;
  @Input() product_main_image_index: number;
  @Input() warehouses: CompanyWarehouse[];

  @Output() updateProductData: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() updateProductImages: EventEmitter<File[]> = new EventEmitter<File[]>();
  @Output() updateProductMainImage: EventEmitter<number> = new EventEmitter<number>();
  @Output() updateProductCategories: EventEmitter<string[][]> = new EventEmitter<string[][]>();


  public warehouse_runways: CompanyWarehouseRunway[][] = [];
  public warehouse_runways_columns: CompanyWarehouseColumn[][] = [];
  public warehouse_columns_shelf: CompanyWarehouseColumnShelf[][] = [];
  public warehouse_fields: {
    runway: { disabled: boolean, spinner: boolean };
    column: { disabled: boolean, spinner: boolean };
    shelf: { disabled: boolean, spinner: boolean };
  }[] = [{
    runway: { disabled: true, spinner: false },
    column: { disabled: true, spinner: false },
    shelf: { disabled: true, spinner: false },
  }];


  public product_categories: string[][] = [];
  public category_temp_id: string;




  // notes for the product
  @ViewChild('productNotes', { static: false }) productNotes: CKEditorComponent;
  public notesFieldCharactersCount = 0;
  public notesFieldEditorTextEditor: { editor: any, config: any, editorInstance?: any, } = {
    editor: ClassicEditor,
    config: {
      placeholder: '',       // this will be translated inside the ngOnInit function

      // bold, italic, underline, ordered/unordered list, link, shortcodes
      toolbar: ['heading', '|', 'bold', 'italic', 'underline', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo'], // , 'placeholder'
      link: {
        decorators: {
          isExternal: {
            mode: 'automatic',
            callback: url => url && (url.startsWith('https://') || url.startsWith('http://')),
            attributes: {
              target: '_blank',
              rel: 'noopener noreferrer'
            }
          },
        }
      },
    }
  };



  // product description
  @ViewChild('productDescription', { static: false }) productDescription: CKEditorComponent;
  public productDescriptionFieldCharactersCount = 0;
  public productDescriptionEditorTextEditor: { editor: any, config: any, editorInstance?: any, } = {
    editor: ClassicEditor,
    config: {
      placeholder: '',       // this will be translated inside the ngOnInit function

      // bold, italic, underline, ordered/unordered list, link, shortcodes
      toolbar: ['bold', 'italic', 'underline', '|', 'bulletedList', 'numberedList', '|', 'undo', 'redo'], // , 'placeholder'
      link: {
        decorators: {
          isExternal: {
            mode: 'automatic',
            callback: url => url && (url.startsWith('https://') || url.startsWith('http://')),
            attributes: {
              target: '_blank',
              rel: 'noopener noreferrer'
            }
          },
        }
      },
    }
  };



  constructor(
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    public translate: TranslateService,
    private utilsService: UtilsService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.notesFieldEditorTextEditor.config.placeholder = await this.translate.get('VIEWS.PRODUCT_PAGE.NOTES_FOR_PRODUCT').toPromise();

    this.product_main_image_index = 0;

  }




  addProductCategory(): void {

    let category: {
      pcategory_id: string;
      label: string
    } = null;

    for (let i = 0; i < this.product_categories_list.length; i++)
      if (this.product_categories_list[i].pcategory_id === this.category_temp_id) {
        category = {
          pcategory_id: this.product_categories_list[i].pcategory_id,
          label: this.product_categories_list[i].label,
        };
      }


    this.product_categories.push([category.pcategory_id, category.label]);
    this.category_temp_id = null;

    this.onUpdateProductCategories();

  }


  onProductCategoryRemove(category: NbTagComponent): void {
    this.product_categories = this.product_categories.filter(cat => cat[1] !== category.text);

    this.onUpdateProductCategories();
  }



  onProductStatusChange(new_status: 'in_stock' | 'available_1_to_3_days' | 'available_1_to_10_days' | 'available_1_to_30_days' | 'with_order' | 'unavailable' | 'temporary_unavailable' | 'out_of_stock' | 'ended' | 'closed'): void {
    this.product.current_status = new_status;

    this.onUpdateProductData();
  }






  // add and remove categories and fields on the specification
  addNewCharacteristicsCategory(): void {
    this.product.specification.push(new ProductSpecificationCategory());
  }
  removeCharacteristicsCategory(index: number): void {
    this.product.specification.splice(index, 1);
  }


  addNewCharacteristicsCategoryField(index: number): void {
    this.product.specification[index].fields.push(new ProductSpecificationField());
  }
  removeCharacteristicsCategoryField(index_category: number, index_field: number): void {
    this.product.specification[index_category].fields.splice(index_field, 1);
  }




  // product notes
  onProductNotesEditorReady(editor): void {
    this.notesFieldEditorTextEditor.editorInstance = editor;
  }
  onProductNotesEditorChange({ editor }: ChangeEvent): void {
    const text = editor.getData();
    this.notesFieldCharactersCount = this.utilsService.removeHTMLtagsFromString(text).length;
  }


  // product description
  onProductDescriptionEditorReady(editor): void {
    this.productDescriptionEditorTextEditor.editorInstance = editor;
  }
  onProductDescriptionEditorChange({ editor }: ChangeEvent): void {
    const text = editor.getData();
    this.productDescriptionFieldCharactersCount = this.utilsService.removeHTMLtagsFromString(text).length;
  }




  // product images
  async onProductImagesSelect(event: NgxDropzoneChangeEvent): Promise<void> {


    if (event?.addedFiles && event.addedFiles.length > 0) {

      for (const file of event.addedFiles as any[]) {


        if (file.size > this.imageMaxFileSize) {
          this.utilsService.showToast({
            message: await this.translate.get('VIEWS.SETTINGS.COMPANY.ALERTS.INVALID.TOO_LARGE_SIZE_IMAGE', { imagesMaxFileSize: this.imageMaxFileSize / 1024 / 1024, name: file.name, }).toPromise(),
            type: 'error',
          });

          return;
        }



        const files: any[] = Array.from(event.addedFiles);
        const reader = new FileReader();

        reader.onload = async (e) => {

          file.url = e.target.result;
          this.productImages.push(file);

        };


        reader.readAsDataURL(file);


      }



      this.onUpdateProductImages();
      this.onUpdateProductMainImage();

    }


  }

  onProductImagesRemoved(file: File): void {
    if (this.product_main_image_index === this.productImages.length - 1)
      this.product_main_image_index = 0;

    this.productImages = this.utilsService.lodash.filter(this.productImages, (filtered_file: any) => filtered_file.url !== (file as any).url);


    this.onUpdateProductImages();
    this.onUpdateProductMainImage();
  }




  // select main image
  onMainImageSelect(index: number): void {
    this.product_main_image_index = index;

    this.onUpdateProductMainImage();
  }





  // outputs
  onUpdateProductData(): void {
    this.updateProductData.emit(this.product);
  }

  onUpdateProductImages(): void {
    this.updateProductImages.emit(this.productImages);
  }

  onUpdateProductMainImage(): void {
    this.updateProductMainImage.emit(this.product_main_image_index);
  }

  onUpdateProductCategories(): void {
    this.updateProductCategories.emit(this.product_categories);
  }





  // stock outfits
  async onChangeWarehouseCode(index: number): Promise<void> {

    if (!this.product.product_stock[index]?.warehouse_id
      || this.product.product_stock[index].warehouse_id === null
      || this.product.product_stock[index].warehouse_id === '') {

      this.warehouse_fields[index].runway.disabled = true;
      this.warehouse_fields[index].column.disabled = true;
      this.warehouse_fields[index].shelf.disabled = true;

      this.product.product_stock[index].runway_id = null;
      this.product.product_stock[index].column_id = null;
      this.product.product_stock[index].column_shelf_id = null;

      return Promise.resolve();

    }




    try {

      this.warehouse_fields[index].runway.spinner = true;

      const tmp_runways: CompanyWarehouseRunway[] = await this.http.get<CompanyWarehouseRunway[]>(`${environment.params.host}/api/settings/company-data/warehouses/${this.product.product_stock[index].warehouse_id}/runways`).toPromise();
      this.warehouse_runways[index] = [];
      this.warehouse_runways[index] = [...tmp_runways];

      this.warehouse_fields[index].runway.spinner = false;
      this.warehouse_fields[index].runway.disabled = false;


      this.warehouse_fields[index].column.disabled = true;
      this.warehouse_fields[index].shelf.disabled = true;



      if (!environment.production)
        console.log(tmp_runways);


      this.cdRef.detectChanges();

      return Promise.resolve();

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }

  }

  async onChangeWarehouseRunwayCode(index: number): Promise<void> {

    if (!this.product.product_stock[index]?.runway_id
      || this.product.product_stock[index].runway_id === null
      || this.product.product_stock[index].runway_id === '') {

      this.warehouse_fields[index].column.disabled = true;
      this.warehouse_fields[index].shelf.disabled = true;

      this.product.product_stock[index].column_id = null;
      this.product.product_stock[index].column_shelf_id = null;

      return Promise.resolve();

    }



    try {

      this.warehouse_fields[index].column.spinner = true;


      const tmp_columns: CompanyWarehouseColumn[] = await this.http.get<CompanyWarehouseColumn[]>(`${environment.params.host}/api/settings/company-data/warehouses/${this.product.product_stock[index].warehouse_id}/runways/${this.product.product_stock[index].runway_id}/columns`).toPromise();
      this.warehouse_runways_columns[index] = [];
      this.warehouse_runways_columns[index] = [...tmp_columns];

      this.warehouse_fields[index].column.spinner = false;
      this.warehouse_fields[index].column.disabled = false;

      this.warehouse_fields[index].shelf.disabled = true;



      if (!environment.production)
        console.log(tmp_columns);


      this.cdRef.detectChanges();

      return Promise.resolve();

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }

  }

  async onChangeWarehouseRunwayColumnCode(index: number): Promise<void> {

    if (!this.product.product_stock[index]?.column_id
      || this.product.product_stock[index].column_id === null
      || this.product.product_stock[index].column_id === '') {

      this.warehouse_fields[index].shelf.disabled = true;
      this.product.product_stock[index].column_shelf_id = null;

      return Promise.resolve();

    }



    try {

      this.warehouse_fields[index].shelf.spinner = true;


      const tmp_shelf: CompanyWarehouseColumnShelf[] = await this.http.get<CompanyWarehouseColumnShelf[]>(`${environment.params.host}/api/settings/company-data/warehouses/${this.product.product_stock[index].warehouse_id}/runways/${this.product.product_stock[index].runway_id}/columns/${this.product.product_stock[index].column_id}/shelf`).toPromise();
      this.warehouse_columns_shelf[index] = [];
      this.warehouse_columns_shelf[index] = [...tmp_shelf];



      this.warehouse_fields[index].shelf.spinner = false;
      this.warehouse_fields[index].shelf.disabled = false;



      if (!environment.production)
        console.log(tmp_shelf);


      this.cdRef.detectChanges();

      return Promise.resolve();

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }

  }


  // delete a row for the stock analysis
  deleteStockRow(index: number): void {

    this.product.product_stock.splice(index, 1);
    this.warehouse_runways.splice(index, 1);
    this.warehouse_runways_columns.splice(index, 1);
    this.warehouse_columns_shelf.splice(index, 1);
    this.warehouse_fields.splice(index, 1);


    if (this.product.product_stock.length === 0)
      this.addStockRow();


    this.onUpdateProductData();

  }

  // add new row of stock
  addStockRow(): void {

    this.product.product_stock.push(new ProductStock());

    this.warehouse_runways.push([]);
    this.warehouse_runways_columns.push([]);
    this.warehouse_columns_shelf.push([]);
    this.warehouse_fields.push({
      runway: { disabled: true, spinner: false },
      column: { disabled: true, spinner: false },
      shelf: { disabled: true, spinner: false },
    });
  }


  calculateProductTotalStock(): void {
    // const tmp_product = new Product();
    this.product.stock = new Product().calculateProductStock(this.product.product_stock);
  }

}
