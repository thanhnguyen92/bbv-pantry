import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HappyHoursListComponent } from './happy-hours-list.component';

describe('HappyHoursListComponent', () => {
  let component: HappyHoursListComponent;
  let fixture: ComponentFixture<HappyHoursListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HappyHoursListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HappyHoursListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
