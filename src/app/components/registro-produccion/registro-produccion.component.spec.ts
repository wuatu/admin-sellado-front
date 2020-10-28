import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroProduccionComponent } from './registro-produccion.component';

describe('RegistroProduccionComponent', () => {
  let component: RegistroProduccionComponent;
  let fixture: ComponentFixture<RegistroProduccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroProduccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
