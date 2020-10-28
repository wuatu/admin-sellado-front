import { TestBed } from '@angular/core/testing';

import { RegistroDevService } from './registro-dev.service';

describe('RegistroDevService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistroDevService = TestBed.get(RegistroDevService);
    expect(service).toBeTruthy();
  });
});
