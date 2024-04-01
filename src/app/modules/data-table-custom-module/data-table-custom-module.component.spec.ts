import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableCustomModuleComponent } from './data-table-custom-module.component';

describe('DataTableCustomModuleComponent', () => {
  let component: DataTableCustomModuleComponent;
  let fixture: ComponentFixture<DataTableCustomModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTableCustomModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTableCustomModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
