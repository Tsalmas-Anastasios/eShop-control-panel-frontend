import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedUserCreationComponent } from './connected-user-creation.component';

describe('ConnectedUserCreationComponent', () => {
  let component: ConnectedUserCreationComponent;
  let fixture: ComponentFixture<ConnectedUserCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectedUserCreationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectedUserCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
