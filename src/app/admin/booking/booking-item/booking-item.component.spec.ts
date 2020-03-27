import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingItemAdminComponent } from './booking-item.component';

describe('BookingItemComponent', () => {
  let component: BookingItemAdminComponent;
  let fixture: ComponentFixture<BookingItemAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingItemAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingItemAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
