import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingAdminComponent } from './booking.component';

describe('BookingComponent', () => {
  let component: BookingAdminComponent;
  let fixture: ComponentFixture<BookingAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
