import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrInscripcionComponent } from './qr-inscripcion.component';

describe('QrInscripcionComponent', () => {
  let component: QrInscripcionComponent;
  let fixture: ComponentFixture<QrInscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrInscripcionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrInscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
