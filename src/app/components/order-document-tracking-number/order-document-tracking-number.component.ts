import { Component, OnInit, Input } from '@angular/core';
import { OrderTypeSearch } from '../../models';

@Component({
  selector: 'app-order-document-tracking-number',
  templateUrl: './order-document-tracking-number.component.html',
  styleUrls: ['./order-document-tracking-number.component.scss']
})
export class OrderDocumentTrackingNumberComponent implements OnInit {

  @Input() order: OrderTypeSearch;

  constructor() { }

  ngOnInit(): void {
  }

}
