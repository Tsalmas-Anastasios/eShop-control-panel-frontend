import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDocumentProofOfOrderComponent } from './order-document-proof-of-order.component';

describe('OrderDocumentProofOfOrderComponent', () => {
  let component: OrderDocumentProofOfOrderComponent;
  let fixture: ComponentFixture<OrderDocumentProofOfOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDocumentProofOfOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDocumentProofOfOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
