import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Country, NewUpdateOrder, OrderPaymentMethod, OrderProductIdentifiers, OrderTypeSearch, Product, PromiseProductsModeling, SessionDataObject } from '../../models';
import { StorageService } from '../../services/storage.service';
import { environment } from '../../../environments/environment';
import { UtilsService } from '../../services/utils.service';
import { SeoService } from '../../services/seo.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { OrderDocumentsCreateService } from '../../services/order-documents-create.service';

@Component({
  selector: 'app-cash-register',
  templateUrl: './cash-register.component.html',
  styleUrls: ['./cash-register.component.scss']
})
export class CashRegisterComponent implements OnInit {

  public cash_registry_products: OrderProductIdentifiers[] = [];
  public searchProductCodeDropdown: boolean[] = [];
  public retrieveProductObject: boolean[] = [];
  public fillProductInfo: boolean[] = [];
  public products: PromiseProductsModeling[][] = [];
  public order: NewUpdateOrder = new NewUpdateOrder();
  public user: SessionDataObject;
  public order_extra_fees: number;
  public countries: Country[] = environment.params.arrays.countries;

  public selling_type: 'directly' | 'order';

  public order_address: 'receive_from_shop' | 'customer_address' = 'receive_from_shop';

  public order_payment_types: OrderPaymentMethod[];

  public searching = false;

  public order_pricing: {
    subtotal: number;
    total_discount: number;
    fees: number;
    extra_fees: number;
    total: number;
  } = {
      subtotal: 0,
      total_discount: 0,
      fees: 0,
      extra_fees: 0,
      total: 0,
    };


  // for telephone input
  public SearchCountryField = SearchCountryField;
  public CountryISO = CountryISO;
  public preferredCountries: CountryISO[] = [];
  public selectedCountryISO: CountryISO = null;

  public order_phone: string;
  public order_cell_phone: string;
  public invoice_data__phone: string;
  public invoice_data__cell_phone: string;


  constructor(
    private http: HttpClient,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private storageService: StorageService,
    private utilsService: UtilsService,
    private seo: SeoService,
    private orderDocumentsCreateService: OrderDocumentsCreateService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.spinner.show();



    this.user = this.storageService.getItem('user');

    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.CASH_REGISTRY.TAB_TITLE').toPromise() });

    // initialize at least one product (empty)
    this.addNewProductToTheList();



    // payment types
    if (this.user?.company_data)
      try {

        this.order_payment_types = await this.http.get<OrderPaymentMethod[]>(`${environment.params.host}/api/payments/methods/list/active`).toPromise();

      } catch (error) {
        this.spinner.hide();

        this.utilsService.standardErrorHandling(error);
      }


    this.spinner.hide();

  }





  addNewProductToTheList(): void {
    this.cash_registry_products.push(new OrderProductIdentifiers());
    this.searchProductCodeDropdown.push(false);
    this.retrieveProductObject.push(false);
    this.fillProductInfo.push(false);
    this.products.push([]);
  }

  removeProductFromTheList(index: number): void {
    this.cash_registry_products.splice(index, 1);
    this.searchProductCodeDropdown.splice(index, 1);
    this.retrieveProductObject.splice(index, 1);
    this.fillProductInfo.splice(index, 1);
    this.products.splice(index, 1);

    this.updateOrderPricing();
  }




  // function to retrieve the products list
  async getProductsList(index, params: { search_type: 'product_code' | 'headline' }): Promise<void> {

    this.searching = true;

    this.searchProductCodeDropdown[index] = true;


    // create params
    const query_params = `${params.search_type}=${this.cash_registry_products[index].product_details[params.search_type]}`;


    // fetching data
    try {

      this.products[index] = await this.http.get<PromiseProductsModeling[]>(`
        ${environment.params.host}/api/ecommerce/store/products/search/global-search?${query_params}
      `).toPromise();

    } catch (error) {
      this.searchProductCodeDropdown[index] = false;

      this.utilsService.standardErrorHandling(error);
    }


    this.searchProductCodeDropdown[index] = false;

  }




  getFocusLinkMenu(event: any, params: { index: number, search_type: 'product_code' | 'headline' }): void {
    if (params.search_type === 'product_code')
      document.getElementById(`productCode_${params.index}`).blur();
    else
      document.getElementById(`productHeadline_${params.index}`).blur();

    event.focus();
  }





  // function to retrieve specific product
  async getSpecificProductInfo(params: { index: number, product_id: string }): Promise<void> {

    this.retrieveProductObject[params.index] = true;

    try {

      // TODO: Add product details here
      const temp_product: Product = await this.http.get<Product>(`${environment.params.host}/api/ecommerce/store/products/${params.product_id}`).toPromise();
      this.cash_registry_products[params.index] = {
        product_id: temp_product.product_id,
        active: true,
        archived: false,
        quantity: 1,
        supplied_customer_price: temp_product.clear_price + temp_product.fees - (temp_product?.discount || 0),
        discount: temp_product?.discount || 0,
        discount_percent: temp_product?.discount_percent || 0,
        fees: temp_product.fees,
        fee_percent: temp_product.fee_percent,
        product_details: {
          product_id: temp_product.product_id,
          headline: temp_product.headline,
          product_brand: temp_product.product_brand,
          categories_belongs: temp_product.categories_belongs,
          product_code: temp_product.product_code,
          product_model: temp_product.product_model,
          stock: temp_product.stock,
          supplied_price: temp_product.supplied_price,
          clear_price: temp_product.clear_price,
          fee_percent: temp_product.fee_percent,
          fees: temp_product.fees,
          discount_percent: temp_product.discount_percent,
          discount: temp_product.discount,
          specification: temp_product.specification,
          product_description: temp_product.product_description,
          supplier: temp_product.supplier,
          current_status: temp_product.current_status,
          archived: temp_product.archived,
          notes: temp_product.notes,
          created_at: temp_product.created_at,
          current_version: temp_product.current_version,
          product_shared: temp_product.product_shared,

          images: temp_product.images,
          product_stock: { ...temp_product.product_stock }
        }
      };


    } catch (error) {
      this.retrieveProductObject[params.index] = false;

      await this.utilsService.standardErrorHandling(error);
    }



    // update the totals
    this.updateOrderPricing();

    // add new product
    if (this.cash_registry_products[this.cash_registry_products.length - 1].product_details.product_code !== ''
      && this.cash_registry_products[this.cash_registry_products.length - 1].product_details.product_code !== null)
      this.addNewProductToTheList();

    this.retrieveProductObject[params.index] = false;
    this.fillProductInfo[params.index] = true;


    this.searching = false;

  }




  // update the total pricing
  updateOrderPricing(): void {

    this.order_pricing.subtotal = 0;
    this.order_pricing.total_discount = 0;
    this.order_pricing.fees = 0;
    this.order_pricing.total = 0;


    for (let i = 0; i < this.cash_registry_products.length; i++) {
      this.order_pricing.subtotal += this.cash_registry_products[i].product_details.clear_price * this.cash_registry_products[i].quantity;

      this.order_pricing.total_discount += (1 - this.cash_registry_products[i].discount_percent / 100) * this.cash_registry_products[i].quantity * this.cash_registry_products[i].supplied_customer_price;

      this.order_pricing.fees += this.cash_registry_products[i].product_details.fees * this.cash_registry_products[i].quantity;
      this.order_pricing.total += this.cash_registry_products[i].product_details.clear_price
        * this.cash_registry_products[i].quantity + this.cash_registry_products[i].product_details.fees
        * this.cash_registry_products[i].quantity
        + this.order_pricing.extra_fees
        - this.order_pricing.total_discount;
    }


  }



  updateProductDiscount(index: number): void {
    this.cash_registry_products[index].discount = (1 - this.cash_registry_products[index].discount_percent / 100) * this.cash_registry_products[index].quantity * this.cash_registry_products[index].supplied_customer_price;
  }




  // check if the quantity === 0 and delete the product
  zeroQuantityOfProduct(index: number) {

    if (this.cash_registry_products[index].quantity === 0)
      this.removeProductFromTheList(index);

    if (this.cash_registry_products.length === 0)
      this.addNewProductToTheList();

  }





  disableActions(): boolean {

    if (this.cash_registry_products.length === 1
      && (!this.cash_registry_products[1]?.product_details?.product_code
        || (this.cash_registry_products[1].product_details.product_code === ''
          || this.cash_registry_products[1].product_details.product_code === null)))
      return false;

    return true;

  }




  clearCashRegistry(): void {
    this.cash_registry_products = [];
    this.searchProductCodeDropdown = [];
    this.retrieveProductObject = [];
    this.products = [];
    this.fillProductInfo = [];
    this.order = new NewUpdateOrder();

    for (const price in this.order_pricing)
      this.order_pricing[price] = 0;


    this.addNewProductToTheList();
  }






  async createNewOrder(order_document_type: 'receipt' | 'invoice'): Promise<void> {

    this.spinner.show();

    this.order.proof = order_document_type;
    this.order.order_products = [...this.cash_registry_products];
    if (!this.order.order_products[this.order.order_products.length - 1]?.product_id)
      this.order.order_products.splice(this.order.order_products.length - 1, 1);

    try {

      if (this.order_address === 'receive_from_shop') {
        this.order.email = '-';
        this.order.first_name = this.order?.first_name || '-';
        this.order.last_name = this.order?.last_name || '-';
        this.order.address = this.user?.company_data?.headquarters_address__street || await this.translate.get('GENERIC.LABELS.N_A').toPromise();
        this.order.postal_code = this.order?.postal_code || this.user?.company_data?.headquarters_address__postal_code || await this.translate.get('GENERIC.LABELS.N_A').toPromise();
        this.order.city = this.user?.company_data?.headquarters_address__city || await this.translate.get('GENERIC.LABELS.N_A').toPromise();
        this.order.country = this.user?.company_data?.headquarters_address__country || await this.translate.get('GENERIC.LABELS.N_A').toPromise();
        this.order.transfer_courier = environment.params.receive_order_from_shop_db_record_id;
      }

      if (this.selling_type === 'directly')
        this.order.current_status = 'completed';

      if (order_document_type === 'invoice')
        this.order.invoice_data__is_valid = true;             // TODO: replace it with mechanism to validate the invoice's data



      this.order.clear_value = this.order_pricing.subtotal;
      this.order.transportation = 0;                          // TODO: add mechanism to calculate the transportation cost

      // TODO: add cash on delivery service
      this.order.cash_on_delivery_payment = false;
      this.order.cash_on_delivery = 0;

      this.order.extra_fees = this.order_pricing?.extra_fees && this.order_pricing.extra_fees > 0 ? true : false;
      this.order.extra_fees_costs = this.order_pricing?.extra_fees && this.order_pricing.extra_fees > 0 ? this.order_pricing.extra_fees : 0;
      this.order.fees = this.order_pricing.fees;
      this.order.fee_percent = this.order_pricing.fees / this.order_pricing.total * 100;
      this.order.order_total = this.order_pricing.total;



      // TODO: create the tracking & choose the transportation courier company
      if (this.order_address !== 'receive_from_shop') {
        this.order.transfer_courier = 'tcr_WMmh_4QojuooXSKimnR7wKo5H3HS0oV1GU8k';
        this.order.tracking_number = '---';
        this.order.tracking_url = '---';
      }



      if (!environment.production)
        console.log(this.order);


      // add new order
      const new_order = await this.http.post<any>(`${environment.params.host}/api/ecommerce/store/orders/ord/new`, this.order).toPromise();







      // print invoices
      if (this.selling_type === 'directly')
        this.orderDocumentsCreateService.printableDocumentsCreatePrinting({
          order_id: new_order.order_identifiers.order_id,
          type: 'single',
          single_document_title: 'invoice_receipt'
        });
      else if (this.selling_type === 'order')
        this.orderDocumentsCreateService.printableDocumentsCreatePrinting({
          order_id: new_order.order_identifiers.order_id,
          type: 'all',
        });



      let message: string;
      if (this.selling_type === 'directly')
        message = await this.translate.get('VIEWS.ORDER_PAGE.ALERTS.NEW_SALE_PAID_SUCCESSFULLY').toPromise();
      else
        message = await this.translate.get('VIEWS.ORDER_PAGE.ALERTS.NEW_ORDER_CREATED_SUCCESSFULLY').toPromise();

      this.utilsService.showToast({
        message: message,
        type: 'success',
      });


      this.clearCashRegistry();

    } catch (error) {
      this.spinner.hide();

      await this.utilsService.standardErrorHandling(error);
    }



    this.spinner.hide();

  }








  toggleCustomerAddress(order_address: 'receive_from_shop' | 'customer_address'): void {
    this.order_address = order_address;
  }



  checkAddressRequiredFields(): boolean {

    if (!this.order?.first_name || !this.order?.last_name || !this.order?.address || !this.order?.postal_code
      || !this.order?.city || !this.order?.country || !this.order?.phone || !this.order?.email)
      return false;

    return true;

  }



  formatTelephone(order_field: 'phone' | 'cell_phone' | 'invoice_data__phone' | 'invoice_data__cell_phone', phone_object: any): void {
    this.order[order_field] = phone_object?.internationalNumber || null;
  }


  toggleSellingType(selling_type: 'directly' | 'order'): void {
    this.selling_type = selling_type;
  }



  async toggleTextInputs(params: { index: number, type: 'blur' | 'focus', field?: 'headline' | 'code' }): Promise<void> {

    if (!this.searching)
      if (params.type === 'blur')
        this.fillProductInfo[params.index] = this.cash_registry_products[params.index]?.product_details?.headline && this.cash_registry_products[params.index]?.product_details?.headline !== null;
      else {
        this.fillProductInfo[params.index] = false;

        await this.utilsService.delay(200);
        if (params?.field)
          if (params.field === 'headline')
            document.getElementById(`productHeadline_${params.index}`).focus();
          else
            document.getElementById(`productCode_${params.index}`).focus();
        else
          document.getElementById(`productCode_${params.index}`).focus();
      }

  }
}
