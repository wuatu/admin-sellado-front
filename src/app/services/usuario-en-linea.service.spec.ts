import { TestBed } from '@angular/core/testing';

import { UsuarioEnLineaService } from './usuario-en-linea.service';

describe('UsuarioEnLineaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsuarioEnLineaService = TestBed.get(UsuarioEnLineaService);
    expect(service).toBeTruthy();
  });
});
