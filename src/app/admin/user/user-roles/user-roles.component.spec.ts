import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRolesAdminComponent } from './user-roles.component';

describe('UserItemComponent', () => {
  let component: UserRolesAdminComponent;
  let fixture: ComponentFixture<UserRolesAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRolesAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRolesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
