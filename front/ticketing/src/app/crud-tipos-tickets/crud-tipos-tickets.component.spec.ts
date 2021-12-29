import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudTiposTicketsComponent } from './crud-tipos-tickets.component';

describe('CrudTiposTicketsComponent', () => {
  let component: CrudTiposTicketsComponent;
  let fixture: ComponentFixture<CrudTiposTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudTiposTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudTiposTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
