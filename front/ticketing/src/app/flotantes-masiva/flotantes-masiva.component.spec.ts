import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlotantesMasivaComponent } from './flotantes-masiva.component';

describe('FlotantesMasivaComponent', () => {
  let component: FlotantesMasivaComponent;
  let fixture: ComponentFixture<FlotantesMasivaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlotantesMasivaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlotantesMasivaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
