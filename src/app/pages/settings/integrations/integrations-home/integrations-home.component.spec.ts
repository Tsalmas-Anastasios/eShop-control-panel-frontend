import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationsHomeComponent } from './integrations-home.component';

describe('IntegrationsHomeComponent', () => {
  let component: IntegrationsHomeComponent;
  let fixture: ComponentFixture<IntegrationsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegrationsHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
