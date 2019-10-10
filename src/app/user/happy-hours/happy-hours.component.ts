import {
  Component,
  OnInit,
  NgZone,
  ViewChild,
  ElementRef,
  Renderer2
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HappyHoursService } from 'src/app/shared/services/happy-hours.service';
import { HappyHoursModel } from 'src/app/shared/models/happy-hours.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AppService } from 'src/app/shared/services/app.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
const APPETIZERS = of([
  {
    name: 'Gỏi xoài tai heo',
    detail: 'Gỏi xoài tai heo',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609491/happy-hours/goi_tocfoq.jpg'
  }
]);
const MAINMENUS = of([
  {
    name: 'Tôm hấp bia',
    detail: 'Tôm hấp bia',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570607320/happy-hours/tom_zyfrp0.jpg'
  },
  {
    name: 'Heo quay bánh hỏi',
    detail: 'Heo quay bánh hỏi',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609488/happy-hours/heoquay_ex0zb7.jpg'
  },
  {
    name: 'Cá phi lê viên sốt Mayonaise',
    detail: 'Cá phi lê viên sốt Mayonaise',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609489/happy-hours/ca_gefdx8.jpg'
  },
  {
    name: 'Ba chỉ Bò cuộn nấm kim châm',
    detail: 'Ba chỉ Bò cuộn nấm kim châm',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609489/happy-hours/bachibo_tv8inq.jpg'
  },
  {
    name: 'Cánh gà ướp gia vị cay với tỏi ớt',
    detail: 'Cánh gà ướp gia vị cay với tỏi ớt',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609488/happy-hours/canhga_pqu1fn.jpg'
  }
]);

const DESSERTS = of([
  {
    name: 'Bia',
    detail: 'Bia',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609204/happy-hours/bia_w0tcnf.jpg'
  },
  {
    name: 'Rau câu',
    detail: 'Rau câu',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609316/happy-hours/raucau_n2gljp.jpg'
  },
  {
    name: 'Nước ngọt',
    detail: 'Nước ngọt',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609203/happy-hours/nuocngot_qacqwc.jpg'
  },
  {
    name: 'Bánh trứng bông lan cuộn',
    detail: 'Bánh trứng bông lan cuộn',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609316/happy-hours/bonglan_enyde7.jpg'
  }
]);
@Component({
  selector: 'app-happy-hours',
  templateUrl: './happy-hours.component.html',
  styleUrls: ['./happy-hours.component.scss']
})
export class HappyHoursComponent implements OnInit {
  formGroup: FormGroup;
  formGroup2: FormGroup;
  @ViewChild('container', { static: false }) container: ElementRef;
  @ViewChild('register', { static: false }) registerLink: ElementRef;
  @ViewChild('registerName', { static: false }) registerName: ElementRef;
  @ViewChild('thumnail', { static: false }) thumnail: ElementRef;
  mainMenus = MAINMENUS;
  desserts = DESSERTS;
  appetizers = APPETIZERS;
  imageDetailUrl: string = '';
  selectedMenu: any = {};
  isOpenDetail = false;
  constructor(
    private fb: FormBuilder,
    private ngZone: NgZone,
    private renderer: Renderer2,
    private happyHoursService: HappyHoursService,
    private appService: AppService,
    private router: Router
  ) {
    this.formGroup = fb.group({
      name: ['', Validators.required]
    });
    this.formGroup2 = fb.group({
      name: ['', Validators.required]
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

  registerHappyHours() {
    const formVal = this.formGroup.value as HappyHoursModel;
    if (this.checkDuplicateName(formVal.name)) {
      // this.duplicateMessage = 'Please fill another name.';
    }
    if (!this.formGroup.invalid) {
      this.appService.setLoadingStatus(true);
      let index = 100;
      while (index > 0) {
        index--;
        this.happyHoursService
          .add(formVal)
          .then(res => {
            console.log(res);
            NotificationService.showSuccessMessage('Register successfully!');
          })
          .finally(() => {
            this.appService.setLoadingStatus(false);
            this.router.navigate(['user', 'registers']);
          });
      }
    }
  }
  register2() {
    const formVal = this.formGroup2.value as HappyHoursModel;
    if (this.checkDuplicateName(formVal.name)) {
      // this.duplicateMessage = 'Please fill another name.';
    }
    if (!this.formGroup2.invalid) {
      this.appService.setLoadingStatus(true);

      this.happyHoursService
        .add(formVal)
        .then(res => {
          console.log(res);
          NotificationService.showSuccessMessage('Register successfully!');
        })
        .finally(() => {
          this.appService.setLoadingStatus(false);
          this.router.navigate(['user', 'registers']);
        });
    }
  }

  viewDetail(menu) {
    'rm-in rm-nodelay'.split(' ').forEach(className => {
      this.container.nativeElement.classList.add(className);
    });
    this.selectedMenu = menu;
    this.imageDetailUrl = menu.thumnail;
    this.isOpenDetail = true;
  }
  getImageUrl() {
    return `url(${this.imageDetailUrl})`;
  }
  closeDetail() {
    this.renderer.removeClass(this.container.nativeElement, 'rm-in');
  }
  focusName() {
    this.closeDetail();
    this.registerName.nativeElement.focus();
  }

  onClickOutside(event) {
    // console.log(event);
    // const modal = document.querySelector('.rm-in');
    // if (!event && modal) {
    //   this.renderer.removeClass(this.container.nativeElement, 'rm-in');
    //   this.isOpenDetail = false;
    // }
  }
  private checkDuplicateName(name) {
    return this.happyHoursService.checkExitsName(name).subscribe(res => {
      if (res && res.length > 0) {
        return true;
      }
      return false;
    });
  }
}
