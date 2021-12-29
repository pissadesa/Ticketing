import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsFlotanteComponent } from './tickets-flotante.component';

describe('TicketsFlotanteComponent', () => {
  let component: TicketsFlotanteComponent;
  let fixture: ComponentFixture<TicketsFlotanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsFlotanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsFlotanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
