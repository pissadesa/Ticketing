import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuPersonaComponent } from './cu-persona.component';

describe('CuPersonaComponent', () => {
  let component: CuPersonaComponent;
  let fixture: ComponentFixture<CuPersonaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuPersonaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuPersonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
