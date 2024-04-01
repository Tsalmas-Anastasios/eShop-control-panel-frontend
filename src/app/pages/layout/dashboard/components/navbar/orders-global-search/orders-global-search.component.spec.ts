import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersGlobalSearchComponent } from './orders-global-search.component';

describe('OrdersGlobalSearchComponent', () => {
  let component: OrdersGlobalSearchComponent;
  let fixture: ComponentFixture<OrdersGlobalSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersGlobalSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersGlobalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
