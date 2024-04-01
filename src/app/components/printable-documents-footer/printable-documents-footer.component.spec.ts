import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintableDocumentsFooterComponent } from './printable-documents-footer.component';

describe('PrintableDocumentsFooterComponent', () => {
  let component: PrintableDocumentsFooterComponent;
  let fixture: ComponentFixture<PrintableDocumentsFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintableDocumentsFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintableDocumentsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
