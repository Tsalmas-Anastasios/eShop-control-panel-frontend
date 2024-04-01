import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsingBizyhiveCollapseComponent } from './using-bizyhive-collapse.component';

describe('UsingBizyhiveCollapseComponent', () => {
  let component: UsingBizyhiveCollapseComponent;
  let fixture: ComponentFixture<UsingBizyhiveCollapseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsingBizyhiveCollapseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsingBizyhiveCollapseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
