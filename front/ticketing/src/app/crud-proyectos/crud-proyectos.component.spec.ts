import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudProyectosComponent } from './crud-proyectos.component';

describe('CrudProyectosComponent', () => {
  let component: CrudProyectosComponent;
  let fixture: ComponentFixture<CrudProyectosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudProyectosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudProyectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
