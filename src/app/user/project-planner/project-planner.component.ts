import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-project-planner',
  templateUrl: './project-planner.component.html',
  styleUrls: ['./project-planner.component.scss']
})
export class ProjectPlannerComponent implements OnInit {
  url = 'https://planner.bbv-demo.ch';
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {}
  get safeUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
}
