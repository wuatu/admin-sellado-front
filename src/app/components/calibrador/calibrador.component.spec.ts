import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalibradorComponent } from './calibrador.component';

describe('CalibradorComponent', () => {
  let component: CalibradorComponent;
  let fixture: ComponentFixture<CalibradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalibradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalibradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
