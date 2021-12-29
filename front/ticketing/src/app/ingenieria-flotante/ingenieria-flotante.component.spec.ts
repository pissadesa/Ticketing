import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngenieriaFlotanteComponent } from './ingenieria-flotante.component';

describe('IngenieriaFlotanteComponent', () => {
  let component: IngenieriaFlotanteComponent;
  let fixture: ComponentFixture<IngenieriaFlotanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngenieriaFlotanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngenieriaFlotanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
