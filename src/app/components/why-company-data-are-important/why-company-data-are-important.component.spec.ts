import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyCompanyDataAreImportantComponent } from './why-company-data-are-important.component';

describe('WhyCompanyDataAreImportantComponent', () => {
  let component: WhyCompanyDataAreImportantComponent;
  let fixture: ComponentFixture<WhyCompanyDataAreImportantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhyCompanyDataAreImportantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyCompanyDataAreImportantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
