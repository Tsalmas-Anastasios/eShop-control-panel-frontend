import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordChangeCredentialsComponent } from './password-change-credentials.component';

describe('PasswordChangeCredentialsComponent', () => {
  let component: PasswordChangeCredentialsComponent;
  let fixture: ComponentFixture<PasswordChangeCredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordChangeCredentialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordChangeCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
