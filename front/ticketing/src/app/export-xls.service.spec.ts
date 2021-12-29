import { TestBed } from '@angular/core/testing';

import { ExportXlsService } from './export-xls.service';

describe('ExportXlsService', () => {
  let service: ExportXlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportXlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
