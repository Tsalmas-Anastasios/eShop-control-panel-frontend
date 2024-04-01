import { Component, OnInit, Input } from '@angular/core';
import { OrderTypeSearch, SessionDataObject } from '../../models';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-order-document-receipt-invoice',
  templateUrl: './order-document-receipt-invoice.component.html',
  styleUrls: ['./order-document-receipt-invoice.component.scss']
})
export class OrderDocumentReceiptInvoiceComponent implements OnInit {

  @Input() order: OrderTypeSearch;
  public date_issued = new Date();
  public discount = 0;

  public user: SessionDataObject;

  constructor(
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {

    if (this.order)
      this.order.order_products.forEach((product) => this.discount += product.discount);

    this.user = this.storageService.getItem('user');

  }

}
