import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoreoCalibradorComponent } from './monitoreo-calibrador.component';

describe('MonitoreoCalibradorComponent', () => {
  let component: MonitoreoCalibradorComponent;
  let fixture: ComponentFixture<MonitoreoCalibradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonitoreoCalibradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitoreoCalibradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
