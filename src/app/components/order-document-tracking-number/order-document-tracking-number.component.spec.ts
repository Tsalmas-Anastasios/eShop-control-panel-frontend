import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDocumentTrackingNumberComponent } from './order-document-tracking-number.component';

describe('OrderDocumentTrackingNumberComponent', () => {
  let component: OrderDocumentTrackingNumberComponent;
  let fixture: ComponentFixture<OrderDocumentTrackingNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDocumentTrackingNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDocumentTrackingNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
