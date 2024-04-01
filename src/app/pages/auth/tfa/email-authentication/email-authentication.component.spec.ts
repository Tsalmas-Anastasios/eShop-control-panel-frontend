import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailAuthenticationComponent } from './email-authentication.component';

describe('EmailAuthenticationComponent', () => {
  let component: EmailAuthenticationComponent;
  let fixture: ComponentFixture<EmailAuthenticationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailAuthenticationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailAuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
