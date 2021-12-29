import { TestBed } from '@angular/core/testing';

import { ApisepomexService } from './apisepomex.service';

describe('ApisepomexService', () => {
  let service: ApisepomexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApisepomexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
