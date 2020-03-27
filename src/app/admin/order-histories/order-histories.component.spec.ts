import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoriesAdminComponent } from './order-histories.component';

describe('OrderHistoriesComponent', () => {
  let component: OrderHistoriesAdminComponent;
  let fixture: ComponentFixture<OrderHistoriesAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderHistoriesAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistoriesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
