import {
  Component,
  OnInit,
  Input,
  Renderer2,
  ElementRef,
  AfterViewInit,
  AfterContentInit
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-plugin',
  templateUrl: './plugin.component.html',
  styleUrls: ['./plugin.component.scss']
})
export class PluginComponent implements OnInit, AfterViewInit {
  matCartElement: any;
  toolBarElement: any;
  isZoom = false;
  @Input() url = '';
  constructor(
    private sanitizer: DomSanitizer,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {}
  ngAfterViewInit(): void {
    this.matCartElement = this.elementRef.nativeElement.querySelector(
      'mat-card'
    );
    this.toolBarElement = document.querySelector('mat-toolbar');
    const ifram = this.elementRef.nativeElement.querySelector('#companyFrame');
    // ifram.onload = () => {
    //   console.log('loaded');
    // };
    console.log(ifram);
    console.log(this.toolBarElement);
  }

  get safeResourceUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
  }

  explain() {
    this.isZoom = true;
    this.matCartElement.classList.add('zoom');
    this.toolBarElement.classList.remove('align-between');
  }

  collapse() {
    this.isZoom = false;
    this.toolBarElement.classList.add('align-between');
    this.matCartElement.classList.remove('zoom');
  }
}
