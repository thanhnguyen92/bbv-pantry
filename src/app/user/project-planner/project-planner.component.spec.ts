import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectPlannerComponent } from './project-planner.component';

describe('ProjectPlannerComponent', () => {
  let component: ProjectPlannerComponent;
  let fixture: ComponentFixture<ProjectPlannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectPlannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
