import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OrderTypeSearch, SessionDataObject } from '../../models';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-order-document-proof-of-order',
  templateUrl: './order-document-proof-of-order.component.html',
  styleUrls: ['./order-document-proof-of-order.component.scss']
})
export class OrderDocumentProofOfOrderComponent implements OnInit {

  @Input() order: OrderTypeSearch;

  public date_issued = new Date();
  public discount = 0;

  public user: SessionDataObject;

  constructor(
    public translate: TranslateService,
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
    if (this.order)
      this.order.order_products.forEach((product) => this.discount += product.discount);

    this.user = this.storageService.getItem('user');
  }

}
