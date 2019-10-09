import {
  Component,
  OnInit,
  NgZone,
  ViewChild,
  ElementRef,
  Renderer2
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';

const $container = $('#rm-container');
const $cover = $container.find('div.rm-cover');
const $middle = $container.find('div.rm-middle');
const $right = $container.find('div.rm-right');
const $open = $cover.find('a.rm-button-open.after');
const $close = $right.find('span.rm-close');
const $details = $container.find('a.rm-viewdetails');
@Component({
  selector: 'app-happy-hours',
  templateUrl: './happy-hours.component.html',
  styleUrls: ['./happy-hours.component.scss']
})
export class HappyHoursComponent implements OnInit {
  formGroup: FormGroup;
  @ViewChild('container', { static: false }) container: ElementRef;
  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    private renderer: Renderer2
  ) {
    this.formGroup = fb.group({
      name: ['', Validators.required],
      email: []
    });
  }

  ngOnInit() {
    // this.ngZone.run(() => {
    //   $open.on('click', event => {
    //     this.openMenu();
    //     return false;
    //   });
    // });
  }

  openMenu() {
    this.container.nativeElement.classList.add('rm-open');
  }

  closeMenu() {
    'rm-open rm-nodelay rm-in'.split(' ').forEach(className => {
      this.renderer.removeClass(this.container.nativeElement, className);
    });
  }
}
