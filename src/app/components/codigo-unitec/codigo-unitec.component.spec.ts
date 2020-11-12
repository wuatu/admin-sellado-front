import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodigoUnitecComponent } from './codigo-unitec.component';

describe('CodigoUnitecComponent', () => {
  let component: CodigoUnitecComponent;
  let fixture: ComponentFixture<CodigoUnitecComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodigoUnitecComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodigoUnitecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
