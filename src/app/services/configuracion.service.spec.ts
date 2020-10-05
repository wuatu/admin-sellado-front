import { TestBed } from '@angular/core/testing';

import { ConfiguracionService } from './configuracion.service';

describe('ConfiguracionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfiguracionService = TestBed.get(ConfiguracionService);
    expect(service).toBeTruthy();
  });
});
