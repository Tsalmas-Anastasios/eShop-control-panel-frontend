import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiddlewareOptionsComponent } from './middleware-options.component';

describe('MiddlewareOptionsComponent', () => {
  let component: MiddlewareOptionsComponent;
  let fixture: ComponentFixture<MiddlewareOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiddlewareOptionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiddlewareOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
