import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusDropdownCustomModuleComponent } from './status-dropdown-custom-module.component';

describe('StatusDropdownCustomModuleComponent', () => {
  let component: StatusDropdownCustomModuleComponent;
  let fixture: ComponentFixture<StatusDropdownCustomModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusDropdownCustomModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusDropdownCustomModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
