import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WardManagement } from './ward-management';

describe('WardManagement', () => {
  let component: WardManagement;
  let fixture: ComponentFixture<WardManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WardManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WardManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
