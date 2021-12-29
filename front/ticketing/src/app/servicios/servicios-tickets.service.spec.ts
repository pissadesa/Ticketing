import { TestBed } from '@angular/core/testing';

import { ServiciosTicketsService } from './servicios-tickets.service';

describe('ServiciosTicketsService', () => {
  let service: ServiciosTicketsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiciosTicketsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
