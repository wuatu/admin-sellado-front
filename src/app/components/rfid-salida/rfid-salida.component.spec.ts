import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfidSalidaComponent } from './rfid-salida.component';

describe('RfidSalidaComponent', () => {
  let component: RfidSalidaComponent;
  let fixture: ComponentFixture<RfidSalidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfidSalidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfidSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
