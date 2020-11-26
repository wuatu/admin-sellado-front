import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RfidRegistroColaboradorComponent } from './rfid-registro-colaborador.component';

describe('RfidRegistroColaboradorComponent', () => {
  let component: RfidRegistroColaboradorComponent;
  let fixture: ComponentFixture<RfidRegistroColaboradorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RfidRegistroColaboradorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RfidRegistroColaboradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
