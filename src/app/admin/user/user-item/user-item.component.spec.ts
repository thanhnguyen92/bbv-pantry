import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserItemAdminComponent } from './user-item.component';

describe('UserItemComponent', () => {
  let component: UserItemAdminComponent;
  let fixture: ComponentFixture<UserItemAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserItemAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserItemAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
