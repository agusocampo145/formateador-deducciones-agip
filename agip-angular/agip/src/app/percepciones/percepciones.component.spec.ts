import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercepcionesComponent } from './percepciones.component';

describe('PercepcionesComponent', () => {
  let component: PercepcionesComponent;
  let fixture: ComponentFixture<PercepcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PercepcionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PercepcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
