import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSelectionComponent } from './booking-selection.component';

describe('BookingSelectionComponent', () => {
  let component: BookingSelectionComponent;
  let fixture: ComponentFixture<BookingSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
