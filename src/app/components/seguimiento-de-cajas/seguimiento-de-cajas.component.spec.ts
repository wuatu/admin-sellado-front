import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoDeCajasComponent } from './seguimiento-de-cajas.component';

describe('SeguimientoDeCajasComponent', () => {
  let component: SeguimientoDeCajasComponent;
  let fixture: ComponentFixture<SeguimientoDeCajasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientoDeCajasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoDeCajasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
