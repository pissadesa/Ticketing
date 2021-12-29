import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoTicketComponent } from './seguimiento-ticket.component';

describe('SeguimientoTicketComponent', () => {
  let component: SeguimientoTicketComponent;
  let fixture: ComponentFixture<SeguimientoTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguimientoTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
