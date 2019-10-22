import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.scss']
})
export class WikiComponent implements OnInit {
  url = 'https://wiki.bbv.vn';
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit() {}

  get safeResourceUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }
}
