import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsGlobalSearchComponent } from './products-global-search.component';

describe('ProductsGlobalSearchComponent', () => {
  let component: ProductsGlobalSearchComponent;
  let fixture: ComponentFixture<ProductsGlobalSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsGlobalSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsGlobalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
