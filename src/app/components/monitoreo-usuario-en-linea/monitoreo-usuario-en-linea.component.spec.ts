import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoUsuarioEnLineaComponent } from './monitoreo-usuario-en-linea.component';

describe('MonitoreoUsuarioEnLineaComponent', () => {
  let component: MonitoreoUsuarioEnLineaComponent;
  let fixture: ComponentFixture<MonitoreoUsuarioEnLineaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreoUsuarioEnLineaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoUsuarioEnLineaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
