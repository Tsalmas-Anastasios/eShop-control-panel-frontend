import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersSearchComponent } from './orders-search.component';

describe('OrdersSearchComponent', () => {
  let component: OrdersSearchComponent;
  let fixture: ComponentFixture<OrdersSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrdersSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
