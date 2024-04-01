import { user_privileges } from './../../../../environments/_arrays/_user-privileges';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { OrderDocumentsCreateService } from './../../../services/order-documents-create.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NbDialogService } from '@nebular/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import {
  StatusDropdownCustomModuleStatusItem, StatusDropdownCustomModuleOptions, OrderTypeSearch, SessionDataObject,
  Country, UserPrivilegesSettings, OrderTransaction
} from '../../../models';
import { UtilsService } from '../../../services/utils.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorComponent, ChangeEvent } from '@ckeditor/ckeditor5-angular';
import { PrintService } from '../../../services/print.service';
import { StorageService } from '../../../services/storage.service';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  public user: SessionDataObject;
  public mode: 'preview' | 'edit' = 'preview';
  public order_id: string;
  public order: OrderTypeSearch;
  public order_editable: OrderTypeSearch;
  public multitude_of_products = 0;
  public default_products_image_url = '../../../../assets/logo/logo-icon.png';
  public notes_updating_procedure_description: 'saved' | 'updating' | 'error' | 'nothing' = 'nothing';

  public statuses: StatusDropdownCustomModuleStatusItem[] = environment.params.arrays.order_statuses.all_formatted;
  public status_dropdown_options: StatusDropdownCustomModuleOptions = environment.status_dropdown_options;

  public orderIsUpdating = false;

  public countries: Country[] = environment.params.arrays.countries;

  public user_privileges: UserPrivilegesSettings;

  public order_transactions: OrderTransaction[] = [];
  private order_transactions_page = 1;
  private order_transactions_first_click = false;
  public order_transactions_loading = false;



  @ViewChild('orderNotes', { static: false }) orderNotes: CKEditorComponent;
  public notesFieldCharactersCount = 0;
  public notesFieldEditorTextEditor: { editor: any, config: any, editorInstance?: any, } = {
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


  // for telephone input
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  public preferredCountries: CountryISO[] = [];
  selectedCountryISO: CountryISO = null;

  public invoice_data__phone_number: string;
  public invoice_data__cell_phone: string;



  @ViewChild('orderPaperDispatchForm', { static: false }) public orderPaperDispatchForm: ElementRef;
  @ViewChild('orderPaperProofOfOrder', { static: false }) public orderPaperProofOfOrder: ElementRef;
  @ViewChild('orderPaperInvoiceReceipt', { static: false }) public orderPaperInvoiceReceipt: ElementRef;
  @ViewChild('orderPaperTrackingNumber', { static: false }) public orderPaperTrackingNumber: ElementRef;

  public hidden_papers: {
    orderPaperDispatchForm: boolean;
    orderPaperProofOfOrder: boolean;
    orderPaperInvoiceReceipt: boolean;
    orderPaperTrackingNumber: boolean;
  } = {
      orderPaperDispatchForm: true,
      orderPaperProofOfOrder: true,
      orderPaperInvoiceReceipt: true,
      orderPaperTrackingNumber: true,
    };

  public order_papers_type: {
    orderPaperDispatchForm: string;
    orderPaperProofOfOrder: string;
    orderPaperInvoiceReceipt: string;
    orderPaperTrackingNumber: string;
  };



  constructor(
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private seo: SeoService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public utilsService: UtilsService,
    private changeDetectorRef: ChangeDetectorRef,
    private nbDialogService: NbDialogService,
    public orderDocumentsCreateService: OrderDocumentsCreateService,
    private storageService: StorageService,
  ) {
  }

  async ngOnInit(): Promise<void> {

    this.spinner.show();

    this.user = this.storageService.getItem('user');
    this.user_privileges = this.utilsService.getUsersPrivileges();


    this.route.queryParams.subscribe(params => {
      if (params?.mode)
        if (params.mode === 'edit' || params.mode === 'preview')
          this.mode = params.mode;
        else
          this.mode = 'preview';
      else
        this.mode = 'preview';



      if (!this.user_privileges?.orders_edit)
        this.mode = 'preview';
    });






    this.notesFieldEditorTextEditor.config.placeholder = await this.translate.get('GENERIC.LABELS.ORDER_NOTES').toPromise();


    this.route.params
      .subscribe(async params => {

        this.order_id = params?.order_id || null;
        if (this.order_id === null)
          this.router.navigate(['/dashboard/orders']);

      });




    this.seo.updatePageMetadata({ title: `${await this.translate.get('GENERIC.LABELS.ORDER').toPromise()} ${this.order_id}` });




    try {

      this.order = await this.http.get<OrderTypeSearch>(`${environment.params.host}/api/ecommerce/store/orders/${this.order_id}`).toPromise();
      this.initializeProductsMainImage();



      if (!environment.production)
        console.log(this.order);

    } catch (error) {
      this.spinner.hide();


      if (error?.status && error.status === 404) {
        this.utilsService.swal.fire({
          title: await this.translate.get('VIEWS.ORDER_PAGE.ALERTS.ORDER_NOT_FOUND').toPromise(),
          html: await this.translate.get('VIEWS.ORDER_PAGE.ALERTS.ORDER_NOT_FOUND_TEXT').toPromise(),
          showConfirmButton: false,
          timer: 4000,
          icon: 'error'
        }).then(() => this.router.navigate(['/dashboard/orders']));

        return Promise.resolve();
      }

      this.utilsService.standardErrorHandling(error);
    }



    // calculate products count
    this.order?.order_products.forEach((product) => this.multitude_of_products += product.quantity);



    if (this.mode === 'edit')
      this.order_editable = { ...this.order };






    this.order_papers_type = {
      orderPaperDispatchForm: await this.translate.get('VIEWS.ORDER_PREVIEW.PAPERS.DISPATCH_FORM').toPromise(),
      orderPaperProofOfOrder: await this.translate.get('VIEWS.ORDER_PREVIEW.PAPERS.ORDER_PROOF').toPromise(),
      orderPaperInvoiceReceipt: this.order?.proof === 'invoice' ? await this.translate.get('VIEWS.ORDER_PREVIEW.PAPERS.INVOICE').toPromise() : await this.translate.get('VIEWS.ORDER_PREVIEW.PAPERS.RECEIPT').toPromise(),
      orderPaperTrackingNumber: await this.translate.get('VIEWS.ORDER_PREVIEW.PAPERS.TRACKING_NUMBER').toPromise(),
    };




    this.spinner.hide();
  }






  changeToggleEditPreview(mode: 'edit' | 'preview'): void {
    this.order_editable = { ...this.order };
    this.mode = mode;
  }





  initializeProductsMainImage(): void {

    for (const product of this?.order?.order_products)
      for (const image of product?.product_details?.images)
        if (image?.main_image)
          product.main_image = image;

  }








  onOrderNotesEditorReady(editor): void {
    this.notesFieldEditorTextEditor.editorInstance = editor;
  }
  async onOrderNotesEditorChange({ editor }: ChangeEvent): Promise<void> {
    this.notes_updating_procedure_description = 'updating';

    const text = editor.getData();
    this.notesFieldCharactersCount = this.utilsService.removeHTMLtagsFromString(text).length;

    if (this.notesFieldCharactersCount <= 8000) {

      // update the notes
      try {


        const response = await this.http.put<any>(`
        ${environment.params.host}/api/ecommerce/store/orders/${this.order.order_id}/notes
      `, { notes: text }).toPromise();


      } catch (error) {
        if (!environment.production)
          console.log(error);

        this.utilsService.showToast({
          message: await this.translate.get('GENERIC.ALERTS.NOTES_CAN_NOT_BE_UPDATED').toPromise(),
          type: 'error'
        });

        this.notes_updating_procedure_description = 'error';
      }


      this.notes_updating_procedure_description = 'saved';

    } else
      this.notes_updating_procedure_description = 'error';

  }





  async onOrderStatusChange(new_status: 'confirmed' | 'sent' | 'completed' | 'archived' | 'returned'): Promise<void> {

    try {

      if (new_status === 'archived')
        this.utilsService.swal.fire({
          title: await this.translate.get('VIEWS.ORDER_PAGE.ALERTS.ORDER_CANCELLATION').toPromise(),
          html: await this.translate.get('VIEWS.ORDER_PAGE.ALERTS.SURE_CANCEL_ORDER', { order_number: this.order.order_number }).toPromise(),
          showCancelButton: true,
          confirmButtonText: await this.translate.get('VIEWS.ORDER_PAGE.ALERTS.CANCEL_ORDER').toPromise(),
          cancelButtonText: await this.translate.get('GENERIC.ACTIONS.CANCEL').toPromise(),
          confirmButtonColor: '#cc0000'
        }).then((result) => {
          if (result.isDismissed)
            return;
        });



      // change the status in the order
      const response = await this.http.put<any>(`
        ${environment.params.host}/api/ecommerce/store/orders/${this.order.order_id}/${new_status}
      `, null).toPromise();




      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.ORDER_PAGE.MESSAGES.ORDER_STATUS_CHANGED_SUCCESSFULLY').toPromise(),
        type: 'success',
      });



      this.order.current_status = new_status;

    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }




  }









  async updateCurrentOrder(): Promise<void> {

    this.orderIsUpdating = true;

    try {

      const response = await this.http.put<any>(`${environment.params.host}/api/ecommerce/store/orders/${this.order.order_id}`, this.order_editable).toPromise();


      this.order = { ...this.order_editable };



      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.ORDER_PAGE.ALERTS.ORDER_UPDATED_SUCCESSFULLY').toPromise(),
        type: 'success',
      });

    } catch (error) {
      this.orderIsUpdating = false;

      await this.utilsService.standardErrorHandling(error);
    }

    this.orderIsUpdating = false;

  }






  formatTelephone(order_object: 'order' | 'order_editable', order_field: 'invoice_data__phone' | 'invoice_data__cell_phone', phone_object: any): void {
    this[order_object][order_field] = phone_object?.internationalNumber || null;
  }




  async loadOrderTransactions(type: 'extend' | 'new', btn_source?: string): Promise<void> {

    if (type === 'new' && this.order_transactions_first_click || type === 'extend' && !this.order_transactions_first_click)
      return Promise.resolve();

    if (this.order_transactions_loading)
      return Promise.resolve();



    if (type === 'new') {
      this.order_transactions = [];
      this.order_transactions_first_click = true;
      this.order_transactions_page = 1;
    } else if (type === 'extend')
      this.order_transactions_page++;


    this.order_transactions_loading = true;


    // get transactions
    try {

      const order_transactions_temp_response = await this.http.get<OrderTransaction[]>(`${environment.params.host}/api/ecommerce/store/orders/${this.order_id}/order-transactions`).toPromise();
      this.order_transactions.push(...order_transactions_temp_response);


      if (!environment.production)
        console.log(this.order_transactions);

    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }


    this.order_transactions_loading = false;


    if (btn_source)
      document.getElementById(btn_source).click();

    return Promise.resolve();

  }






  async orderPaperDownloadPDF(ngTemplateElement: string): Promise<void> {

    this.hidden_papers[ngTemplateElement] = false;


    const paper_height_minus: {
      orderPaperDispatchForm: number;
      orderPaperProofOfOrder: number;
      orderPaperInvoiceReceipt: number;
      orderPaperTrackingNumber: number;
    } = {
      orderPaperDispatchForm: 500,
      orderPaperProofOfOrder: 300,
      orderPaperInvoiceReceipt: 500,
      orderPaperTrackingNumber: 500,
    };


    const paper_type = this.order_papers_type[ngTemplateElement];

    await this.utilsService.delay(100);

    const dimensions: {
      width: number;
      height: number;
    } = {
      width: 600,
      height: this[ngTemplateElement].nativeElement.clientHeight / 1.3333 - paper_height_minus[ngTemplateElement],
    };


    const element = document.getElementById(ngTemplateElement);
    this.utilsService.html_to_canvas(element)
      .then(canvas => {

        const contentDataUrl = canvas.toDataURL('image/png');
        const pdf = new this.utilsService.jsPdf('p', 'pt', 'a4');
        pdf.addImage(contentDataUrl, 'PNG', 0, 0, dimensions.width, dimensions.height);
        pdf.save(`ORD. ${this.order.order_number} - ${paper_type} .pdf`);

      })
      .catch(error => this.utilsService.standardErrorHandling(error));


    this.hidden_papers[ngTemplateElement] = true;

  }





  toggleFirstClickTransactions(): void {
    this.order_transactions_first_click = false;
  }




}
