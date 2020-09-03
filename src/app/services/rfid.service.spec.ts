import { TestBed } from '@angular/core/testing';

import { RfidService } from './rfid.service';

describe('RfidService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RfidService = TestBed.get(RfidService);
    expect(service).toBeTruthy();
  });
});
