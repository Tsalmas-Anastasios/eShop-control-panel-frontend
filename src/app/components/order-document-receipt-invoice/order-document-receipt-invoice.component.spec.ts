import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDocumentReceiptInvoiceComponent } from './order-document-receipt-invoice.component';

describe('OrderDocumentReceiptInvoiceComponent', () => {
  let component: OrderDocumentReceiptInvoiceComponent;
  let fixture: ComponentFixture<OrderDocumentReceiptInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDocumentReceiptInvoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDocumentReceiptInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
