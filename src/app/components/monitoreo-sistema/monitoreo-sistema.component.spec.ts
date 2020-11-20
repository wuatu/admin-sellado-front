import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoSistemaComponent } from './monitoreo-sistema.component';

describe('MonitoreoSistemaComponent', () => {
  let component: MonitoreoSistemaComponent;
  let fixture: ComponentFixture<MonitoreoSistemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreoSistemaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoSistemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
