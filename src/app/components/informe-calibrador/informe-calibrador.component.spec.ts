import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeCalibradorComponent } from './informe-calibrador.component';

describe('InformeCalibradorComponent', () => {
  let component: InformeCalibradorComponent;
  let fixture: ComponentFixture<InformeCalibradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformeCalibradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeCalibradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
