import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pm-web',
  templateUrl: './pm-web.component.html',
  styleUrls: ['./pm-web.component.scss']
})
export class PmWebComponent implements OnInit {
  url = 'https://pmweb.bbv.ch';
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {}

  get safeResourceUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
}
