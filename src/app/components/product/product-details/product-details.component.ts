import { UtilsService } from './../../../services/utils.service';
import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import {
  Product, ProductCategory, ProductSpecificationCategory, ProductSpecificationField, ProductTransaction, SessionDataObject, StatusDropdownCustomModuleOptions,
  StatusDropdownCustomModuleStatusItem, CompanyWarehouse, CompanyWarehouseRunway, CompanyWarehouseColumn, CompanyWarehouseColumnShelf, ProductStock
} from '../../../models';
import { TranslateService } from '@ngx-translate/core';
import { NbTagComponent } from '@nebular/theme';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorComponent, ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { ControlContainer, NgForm } from '@angular/forms';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class ProductDetailsComponent implements OnInit, OnChanges {

  @Input() user: SessionDataObject;
  @Input() product: Product;
  @Input() product_categories_list: ProductCategory[];
  @Input() product_statuses: any;
  @Input() formatted_product_statuses: StatusDropdownCustomModuleStatusItem;
  @Input() status_dropdown_options: StatusDropdownCustomModuleOptions;
  @Input() productImages: File[];
  @Input() imageMaxFileSize: number;
  @Input() product_main_image_index: number;
  @Input() mode: 'edit' | 'preview';
  @Input() deleted_images: string[];
  @Input() notes_updating_procedure_description: 'saved' | 'updating' | 'error' | 'nothing';
  @Input() warehouses: CompanyWarehouse[];



  @Output() product_status_change: EventEmitter<
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
  > = new EventEmitter<
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
  >();
  @Output() product_notes_update: EventEmitter<string> = new EventEmitter<string>();
  @Output() product_categories_update: EventEmitter<string[][]> = new EventEmitter<string[][]>();
  @Output() updateProductData: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() updateProductImages: EventEmitter<File[]> = new EventEmitter<File[]>();
  @Output() updateProductMainImage: EventEmitter<number> = new EventEmitter<number>();


  public category_temp_id: string;
  public product_categories: string[][] = [];


  public product_transactions_placeholder = [];
  private product_transactions_page_size = 6;
  public product_transactions_loading = false;
  private product_transactions_first_click = false;
  public product_transactions: ProductTransaction[] = [];
  private product_transactions_page = 1;




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




  // stock analysis warehouses
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

  public stock_analysis: {
    warehouse_label: string;
    runway_label: string;
    column_label: string;
    shelf_label: string;
    stock_quantity: number;
  }[] = [];



  constructor(
    private http: HttpClient,
    public translate: TranslateService,
    public utilsService: UtilsService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.product_main_image_index = -1;
    this.onUpdateProductMainImage();



    // setting the warehouses data
    this.initializeAnalysisStock();

  }



  ngOnChanges(changes): void {

    if (!this.product)
      this.product = changes.currentValue ? changes.currentValue.product : null;


    if (this.product_categories.length <= 0 && this.product)
      this.product_categories = Object.entries(this.product.categories_belongs);


  }





  onProductStatusChange(new_status:
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
  ): void {
    this.product_status_change.emit(new_status);
  }



  async addProductCategory(): Promise<void> {

    // check if the category is already selected
    for (let i = 0; i < this.product_categories.length; i++)
      if (this.product_categories[i][0] === this.category_temp_id) {
        this.utilsService.showToast({
          message: await this.translate.get('VIEWS.PRODUCT_PAGE.ALERTS.CATEGORY_ALREADY_INSERTED', { category_name: this.product_categories[i][1] }).toPromise(),
          type: 'warning',
        });

        this.category_temp_id = null;

        return;
      }



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


    this.onProductCategoriesUpdate();

  }



  async onProductCategoryRemove(category: NbTagComponent): Promise<void> {
    if (this.product_categories.length === 1) {
      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.PRODUCT_PAGE.ALERTS.THE_PRODUCT_CANNOT_HAVE_NO_CATEGORIES').toPromise(),
        type: 'warning',
      });

      return;
    }

    this.product_categories = this.product_categories.filter(cat => cat[1] !== category.text);
    this.onProductCategoriesUpdate();
  }



  onProductCategoriesUpdate(): void {
    this.product_categories_update.emit(this.product_categories);
  }




  // product notes
  onProductNotesEditorReady(editor): void {
    this.notesFieldEditorTextEditor.editorInstance = editor;
  }
  onProductNotesEditorChange({ editor }: ChangeEvent): void {
    const text = editor.getData();
    this.notesFieldCharactersCount = this.utilsService.removeHTMLtagsFromString(text).length;

    this.product_notes_update.emit(text);
  }




  // product specification - categories
  addNewCharacteristicsCategory(): void {
    this.product.specification.push(new ProductSpecificationCategory());
  }
  removeCharacteristicsCategory(index: number): void {
    this.product.specification.splice(index, 1);
    this.onProductDataUpdate();
  }



  // product specification - fields
  addNewCharacteristicsCategoryField(index: number): void {
    this.product.specification[index].fields.push(new ProductSpecificationField());
  }
  removeCharacteristicsCategoryField(index_category: number, index_field: number): void {
    this.product.specification[index_category].fields.splice(index_field, 1);
    this.onProductDataUpdate();
  }



  // product description
  onProductDescriptionEditorReady(editor): void {
    this.productDescriptionEditorTextEditor.editorInstance = editor;
  }
  onProductDescriptionEditorChange({ editor }: ChangeEvent): void {
    const text = editor.getData();
    this.productDescriptionFieldCharactersCount = this.utilsService.removeHTMLtagsFromString(text).length;
  }




  // product new images
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


      this.onProductDataUpdate();
      this.onUpdateProductImages();
      this.onUpdateProductMainImage();

    }


  }
  onProductImagesRemoved(file: File): void {
    if (this.product_main_image_index === this.productImages.length - 1)
      this.product_main_image_index = 0;

    this.productImages = this.utilsService.lodash.filter(this.productImages, (filtered_file: any) => filtered_file.url !== (file as any).url);


    this.onProductDataUpdate();
    this.onUpdateProductImages();
    this.onUpdateProductMainImage();
  }

  // main image
  onMainImageSelect(params: { part: 'existing' | 'new', index: number }): void {

    this.product_main_image_index = -1;

    for (let i = 0; i < this.product.images.length; i++)
      this.product.images[i].main_image = false;


    if (params.part === 'existing')
      this.product.images[params.index].main_image = true;
    else
      this.product_main_image_index = params.index;




    this.onProductDataUpdate();
    this.onUpdateProductMainImage();

  }

  // delete existing image
  onExistingImageDelete(index: number): void {
    if (this.product.images.length - 1 === index && this.product.images[index].main_image)
      this.product.images[index - 1].main_image = true;

    this.product.images.splice(index, 1);



    this.onProductDataUpdate();
  }





  // update data event emitters
  onProductDataUpdate(): void {
    this.updateProductData.emit(this.product);
  }
  onUpdateProductImages(): void {
    this.updateProductImages.emit(this.productImages);
  }
  onUpdateProductMainImage(): void {
    this.updateProductMainImage.emit(this.product_main_image_index);
  }




  onToggleOtherTabTransactions(): void {
    this.product_transactions_first_click = false;
  }



  // load more transactions
  async onLoadMoreProductTransactions(type: 'extend' | 'new', btn_source?: string): Promise<void> {
    if (type === 'new' && this.product_transactions_first_click || type === 'extend' && !this.product_transactions_first_click)
      return Promise.resolve();

    if (this.product_transactions_loading)
      return Promise.resolve();



    if (type === 'new') {
      this.product_transactions = [];
      this.product_transactions_first_click = true;
      this.product_transactions_page = 1;
    } else if (type === 'extend')
      this.product_transactions_page++;

    this.product_transactions_loading = true;
    this.product_transactions_placeholder = new Array(this.product_transactions_page_size);


    // get transactions
    try {

      const product_transactions_response = await this.http.get<ProductTransaction[]>(`${environment.params.host}/api/ecommerce/store/products/${this.product.product_id}/product-transactions?page=${this.product_transactions_page}`).toPromise();

      for (const product_transaction of product_transactions_response)
        if (product_transaction?.quantity_removed || product_transaction?.quantity_added)
          for (const warehouse of this.warehouses) {
            if (product_transaction.warehouse_id !== warehouse.warehouse_id)
              continue;


            product_transaction.warehouse_id = warehouse.code_name;
            for (const runway of warehouse.runways) {
              if (product_transaction.runway_id !== runway.runway_id)
                continue;

              product_transaction.runway_id = runway.runway_code;
              for (const column of runway.columns) {
                if (product_transaction.column_id !== column.column_id)
                  continue;

                product_transaction.column_id = column.column_code;
                for (const shelf of column.shelf)
                  if (shelf.shelf_id === product_transaction.column_shelf_id) {
                    product_transaction.column_shelf_id = shelf.shelf_code;
                    break;
                  }

                break;
              }

              break;
            }

            break;
          }


      this.product_transactions.push(...product_transactions_response);


      if (!environment.production)
        console.log(this.product_transactions);

    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }




    this.product_transactions_loading = false;


    if (btn_source)
      document.getElementById(btn_source).click();

    return Promise.resolve();

  }




  // stock analysis - initialize all the objects
  initializeAnalysisStock(): void {

    if (this.product?.product_stock?.length <= 0) {
      this.product.product_stock = [];
      this.addStockRow();
      return;
    }



    this.warehouse_fields = [];

    for (const product_stock of this.product.product_stock) {

      const product_stock_preview_data = {
        warehouse_label: null,
        runway_label: null,
        column_label: null,
        shelf_label: null,
        stock_quantity: product_stock.stock_quantity,
      };




      for (const warehouse of this.warehouses) {

        if (warehouse.warehouse_id !== product_stock.warehouse_id)
          continue;


        product_stock_preview_data.warehouse_label = warehouse.code_name;


        for (const runway of warehouse.runways) {

          if (runway.runway_id !== product_stock.runway_id)
            continue;


          this.warehouse_runways.push(warehouse.runways);

          product_stock_preview_data.runway_label = runway.runway_code;

          for (const column of runway.columns) {

            if (column.column_id !== product_stock.column_id)
              continue;


            this.warehouse_runways_columns.push(runway.columns);

            product_stock_preview_data.column_label = column.column_code;


            for (const shelf of column.shelf) {

              if (shelf.shelf_id !== product_stock.column_shelf_id)
                continue;


              this.warehouse_columns_shelf.push(column.shelf);

              product_stock_preview_data.shelf_label = shelf.shelf_code;
              break;

            }

            break;

          }

          break;

        }

        break;

      }




      this.warehouse_fields.push({
        runway: { disabled: false, spinner: false },
        column: { disabled: false, spinner: false },
        shelf: { disabled: false, spinner: false },
      });


      this.stock_analysis.push(product_stock_preview_data);

    }



    console.log(this.warehouse_fields);

  }





  // stock outfits
  onChangeWarehouseCode(index: number): void {

    if (!this.product.product_stock[index]?.warehouse_id
      || this.product.product_stock[index].warehouse_id === null
      || this.product.product_stock[index].warehouse_id === '') {

      this.warehouse_fields[index].runway.disabled = true;
      this.warehouse_fields[index].column.disabled = true;
      this.warehouse_fields[index].shelf.disabled = true;

      this.product.product_stock[index].runway_id = null;
      this.product.product_stock[index].column_id = null;
      this.product.product_stock[index].column_shelf_id = null;


      return;

    }



    this.product.product_stock[index].runway_id = null;
    this.product.product_stock[index].column_id = null;
    this.product.product_stock[index].column_shelf_id = null;

    this.warehouse_fields[index].column.disabled = true;
    this.warehouse_fields[index].shelf.disabled = true;



    this.warehouse_runways[index] = [];


    for (const warehouse of this.warehouses)
      if (warehouse.warehouse_id === this.product.product_stock[index].warehouse_id) {
        this.warehouse_runways[index] = [...warehouse.runways];
        this.warehouse_fields[index].runway.disabled = false;

        break;
      }

  }

  onChangeWarehouseRunwayCode(index: number): void {

    if (!this.product.product_stock[index]?.runway_id
      || this.product.product_stock[index].runway_id === null
      || this.product.product_stock[index].runway_id === '') {

      this.warehouse_fields[index].column.disabled = true;
      this.warehouse_fields[index].shelf.disabled = true;

      this.product.product_stock[index].column_id = null;
      this.product.product_stock[index].column_shelf_id = null;

      return;

    }




    this.product.product_stock[index].column_id = null;
    this.product.product_stock[index].column_shelf_id = null;

    this.warehouse_fields[index].shelf.disabled = true;



    this.warehouse_runways_columns[index] = [];


    for (const runway of this.warehouse_runways[index])
      if (runway.runway_id === this.product.product_stock[index].runway_id) {
        this.warehouse_runways_columns[index] = [...runway.columns];
        this.warehouse_fields[index].column.disabled = false;

        break;
      }

  }

  onChangeWarehouseRunwayColumnCode(index: number): void {

    if (!this.product.product_stock[index]?.column_id
      || this.product.product_stock[index].column_id === null
      || this.product.product_stock[index].column_id === '') {

      this.warehouse_fields[index].shelf.disabled = true;
      this.product.product_stock[index].column_shelf_id = null;

      return;

    }



    this.warehouse_columns_shelf[index] = [];


    for (const column of this.warehouse_runways_columns[index])
      if (column.column_id === this.product.product_stock[index].column_id) {
        this.warehouse_columns_shelf[index] = [...column.shelf];
        this.warehouse_fields[index].shelf.disabled = false;

        break;
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


    this.onProductDataUpdate();

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
