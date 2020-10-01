import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionPorCalibradorComponent } from './produccion-por-calibrador.component';

describe('ProduccionPorCalibradorComponent', () => {
  let component: ProduccionPorCalibradorComponent;
  let fixture: ComponentFixture<ProduccionPorCalibradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProduccionPorCalibradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduccionPorCalibradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
