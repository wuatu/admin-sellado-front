import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoCalibrador1Component } from './monitoreo-calibrador1.component';

describe('MonitoreoCalibrador1Component', () => {
  let component: MonitoreoCalibrador1Component;
  let fixture: ComponentFixture<MonitoreoCalibrador1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreoCalibrador1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoCalibrador1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
