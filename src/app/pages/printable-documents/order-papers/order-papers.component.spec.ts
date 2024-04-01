import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPapersComponent } from './order-papers.component';

describe('OrderPapersComponent', () => {
  let component: OrderPapersComponent;
  let fixture: ComponentFixture<OrderPapersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderPapersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPapersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
