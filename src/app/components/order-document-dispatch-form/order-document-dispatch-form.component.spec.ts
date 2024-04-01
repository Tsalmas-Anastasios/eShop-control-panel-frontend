import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDocumentDispatchFormComponent } from './order-document-dispatch-form.component';

describe('OrderDocumentDispatchFormComponent', () => {
  let component: OrderDocumentDispatchFormComponent;
  let fixture: ComponentFixture<OrderDocumentDispatchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderDocumentDispatchFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDocumentDispatchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
