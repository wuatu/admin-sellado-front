import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionPorLineaComponent } from './produccion-por-linea.component';

describe('ProduccionPorLineaComponent', () => {
  let component: ProduccionPorLineaComponent;
  let fixture: ComponentFixture<ProduccionPorLineaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProduccionPorLineaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduccionPorLineaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
