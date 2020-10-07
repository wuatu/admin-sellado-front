import { TestBed } from '@angular/core/testing';

import { UsuarioAdminService } from './usuario-admin.service';

describe('UsuarioAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UsuarioAdminService = TestBed.get(UsuarioAdminService);
    expect(service).toBeTruthy();
  });
});
