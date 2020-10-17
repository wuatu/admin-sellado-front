import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoCalibrador2Component } from './monitoreo-calibrador2.component';

describe('MonitoreoCalibrador2Component', () => {
  let component: MonitoreoCalibrador2Component;
  let fixture: ComponentFixture<MonitoreoCalibrador2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreoCalibrador2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoCalibrador2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
