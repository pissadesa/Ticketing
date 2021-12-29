import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuProyectoComponent } from './cu-proyecto.component';

describe('CuProyectoComponent', () => {
  let component: CuProyectoComponent;
  let fixture: ComponentFixture<CuProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuProyectoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
