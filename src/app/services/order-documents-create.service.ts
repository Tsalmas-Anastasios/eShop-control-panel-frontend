import { Injectable } from '@angular/core';
import { PrintService } from './print.service';
import { OrderDocumentsPrintOptions, OrderTypeSearch } from '../models';

@Injectable({
  providedIn: 'root'
})
export class OrderDocumentsCreateService {

  private print_link = 'order-papers';

  constructor(
    private printService: PrintService,
  ) { }



  printableDocumentsCreatePrinting(data: {
    order?: OrderTypeSearch,
    order_id?: string,
    type: 'single' | 'all' | 'custom',
    custom_print_options?: OrderDocumentsPrintOptions,
    single_document_title?: 'proof_of_order' | 'invoice_receipt' | 'dispatch_form' | 'tracking_number',
  }): void {

    const documents = [];
    if (data.type === 'single')
      documents.push(data.single_document_title);
    else if (data.type === 'all') {
      documents.push('proof_of_order', 'invoice_receipt');
      if (data.order?.tracking_number)
        documents.push('dispatch_form', 'tracking_number');
    } else if (data.type === 'custom') {
      if (data.custom_print_options?.proof_of_order)
        documents.push('proof_of_order');
      if (data.custom_print_options?.order_document)
        documents.push('invoice_receipt');
      if (data.custom_print_options?.order_dispatch_form)
        documents.push('dispatch_form');
      if (data.custom_print_options?.tracking_number)
        documents.push('tracking_number');
    }


    this.printService.printDocument(this.print_link, { order_id: data?.order?.order_id || data?.order_id || null, documents: documents });

  }


}
