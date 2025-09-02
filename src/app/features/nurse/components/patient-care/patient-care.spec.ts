import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientCare } from './patient-care';

describe('PatientCare', () => {
  let component: PatientCare;
  let fixture: ComponentFixture<PatientCare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientCare]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientCare);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
