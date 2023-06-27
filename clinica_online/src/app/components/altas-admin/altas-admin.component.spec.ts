import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltasAdminComponent } from './altas-admin.component';

describe('AltasAdminComponent', () => {
  let component: AltasAdminComponent;
  let fixture: ComponentFixture<AltasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltasAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AltasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
