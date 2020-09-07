import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioEnLineaComponent } from './usuario-en-linea.component';

describe('UsuarioEnLineaComponent', () => {
  let component: UsuarioEnLineaComponent;
  let fixture: ComponentFixture<UsuarioEnLineaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioEnLineaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioEnLineaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
