import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionUsuariosComponent } from './seleccion-usuarios.component';

describe('SeleccionUsuariosComponent', () => {
  let component: SeleccionUsuariosComponent;
  let fixture: ComponentFixture<SeleccionUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeleccionUsuariosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
