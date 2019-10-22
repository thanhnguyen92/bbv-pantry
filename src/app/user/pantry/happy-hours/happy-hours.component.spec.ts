import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HappyHoursComponent } from './happy-hours.component';

describe('HappyHoursComponent', () => {
  let component: HappyHoursComponent;
  let fixture: ComponentFixture<HappyHoursComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HappyHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HappyHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
