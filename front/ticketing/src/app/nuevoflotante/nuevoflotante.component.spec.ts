import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoflotanteComponent } from './nuevoflotante.component';

describe('NuevoflotanteComponent', () => {
  let component: NuevoflotanteComponent;
  let fixture: ComponentFixture<NuevoflotanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevoflotanteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoflotanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
