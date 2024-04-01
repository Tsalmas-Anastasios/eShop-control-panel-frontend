import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedUserDetailsComponent } from './connected-user-details.component';

describe('ConnectedUserDetailsComponent', () => {
  let component: ConnectedUserDetailsComponent;
  let fixture: ComponentFixture<ConnectedUserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectedUserDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectedUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
