import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispathComponent } from './dispath.component';

describe('DispathComponent', () => {
  let component: DispathComponent;
  let fixture: ComponentFixture<DispathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispathComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
