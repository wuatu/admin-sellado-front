import { TestBed } from '@angular/core/testing';

import { LectorService } from './lector.service';

describe('LectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LectorService = TestBed.get(LectorService);
    expect(service).toBeTruthy();
  });
});
