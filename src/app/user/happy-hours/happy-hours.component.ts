import {
  Component,
  OnInit,
  NgZone,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HappyHoursService } from 'src/app/shared/services/happy-hours.service';
import { HappyHoursModel } from 'src/app/shared/models/happy-hours.model';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { AppService } from 'src/app/shared/services/app.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { utils } from 'protractor';
import { Utilities } from 'src/app/shared/services/utilities';
const APPETIZERS = of([
  {
    name: 'Gỏi xoài tai heo',
    detail: 'Pork with mango salad',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609491/happy-hours/goi_tocfoq.jpg'
  }
]);
const MAINMENUS = of([
  {
    name: 'Tôm hấp bia',
    detail: 'Shrimp steamed with beer',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570607320/happy-hours/tom_zyfrp0.jpg'
  },
  {
    name: 'Heo quay bánh hỏi',
    detail: 'Roasted pork with fine rice vermicelli',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609488/happy-hours/heoquay_ex0zb7.jpg'
  },
  {
    name: 'Xôi vò hạt sen',
    detail: 'Sticky rice with lotus seeds',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1571037483/happy-hours/xoi_ajd7qz.jpg'
  },
  {
    name: 'Cá phi lê viên sốt Mayonaise',
    detail: 'Fish fillet with Mayonnaise sauce',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609489/happy-hours/ca_gefdx8.jpg'
  },
  {
    name: 'Ba chỉ Bò cuộn nấm kim châm',
    detail: 'Beef bacon with enoki mushrooms',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609489/happy-hours/bachibo_tv8inq.jpg'
  },
  {
    name: 'Cánh gà ướp gia vị cay với tỏi ớt',
    detail: 'Chiken wings marinated with chill and garlic',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609488/happy-hours/canhga_pqu1fn.jpg'
  }
]);

const DESSERTS = of([
  {
    name: 'Rau câu',
    detail: 'Rau câu',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609316/happy-hours/raucau_n2gljp.jpg'
  },
  {
    name: 'Bánh trứng bông lan cuộn',
    detail: 'Bánh trứng bông lan cuộn',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609316/happy-hours/bonglan_enyde7.jpg'
  },
  {
    name: 'Bia',
    detail: 'Beer',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609204/happy-hours/bia_w0tcnf.jpg'
  },
  {
    name: 'Nước ngọt',
    detail: 'Nước ngọt',
    thumnail:
      'https://res.cloudinary.com/bbvpantry/image/upload/c_scale,h_200,w_200/v1570609203/happy-hours/nuocngot_qacqwc.jpg'
  }
]);
@Component({
  selector: 'app-happy-hours',
  templateUrl: './happy-hours.component.html',
  styleUrls: ['./happy-hours.component.scss']
})
export class HappyHoursComponent implements OnInit, AfterViewInit {
  formGroup: FormGroup;
  formGroup2: FormGroup;
  @ViewChild('container', { static: false }) container: ElementRef;
  @ViewChild('registerLink', { static: false }) registerLink: ElementRef;

  @ViewChild('registerLink2', { static: false }) register2Link: ElementRef;

  @ViewChild('registerName', { static: false }) registerName: ElementRef;
  @ViewChild('thumnail', { static: false }) thumnail: ElementRef;
  mainMenus = MAINMENUS;
  desserts = DESSERTS;
  appetizers = APPETIZERS;
  imageDetailUrl: '';
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
  ngAfterViewInit(): void {
    this.registerTimout();
  }
  openMenu() {
    this.container.nativeElement.classList.add('rm-open');
  }

  closeMenu() {
    'rm-open rm-nodelay rm-in'.split(' ').forEach(className => {
      this.renderer.removeClass(this.container.nativeElement, className);
    });
  }

  async registerHappyHours() {
    const formVal = this.formGroup.value as HappyHoursModel;
    let isDuplicate = false;
    if (!this.formGroup.invalid) {
      this.appService.setLoadingStatus(true);
    }
    await this.checkDuplicateName(formVal.name).then((res: boolean) => {
      isDuplicate = res;
      if (res) {
        this.formGroup.controls.name.setErrors({ isDuplicate: true });
        this.appService.setLoadingStatus(false);
      }
    });
    if (!this.formGroup.invalid && !this.registerTimout() && !isDuplicate) {
      // this.checkDuplicateName(formVal.name).subscribe(res => {
      //   if (!res || res.length === 0) {

      this.happyHoursService
        .add(formVal)
        .then(response => {
          NotificationService.showSuccessMessage('Register successfully!');
        })
        .finally(() => {
          this.appService.setLoadingStatus(false);
          this.router.navigate(['user', 'registers']);
        });
      //   }
      // });
    }
  }
  async registerHappyHoursInner() {
    const formVal = this.formGroup2.value as HappyHoursModel;
    let isDuplicate = false;
    if (!this.formGroup2.invalid) {
      this.appService.setLoadingStatus(true);
    }
    await this.checkDuplicateName(formVal.name).then((res: boolean) => {
      isDuplicate = res;
      if (res) {
        this.formGroup2.controls.name.setErrors({ isDuplicate: true });
        this.appService.setLoadingStatus(false);
      }
    });
    
    if (!this.formGroup2.invalid && !this.registerTimout() && !isDuplicate) {
      // this.checkDuplicateName(formVal.name).subscribe(res => {
      // if (!res || res.length === 0) {

      this.happyHoursService
        .add(formVal)
        .then(response => {
          NotificationService.showSuccessMessage('Register successfully!');
        })
        .finally(() => {
          this.appService.setLoadingStatus(false);
          this.router.navigate(['user', 'registers']);
        });
      // }
      // });
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
  get name() {
    return this.formGroup.controls.name;
  }

  get name2() {
    return this.formGroup2.controls.name;
  }
  private checkDuplicateName(name) {
    return new Promise((resolve, reject) => {
      this.happyHoursService.checkExitsName(name).subscribe(res => {
        if (res && res.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
  private registerTimout() {
    const currentDate = new Date();
    const expiredDate = new Date(2019, 10, 18);
    if (Utilities.compareDates(currentDate, expiredDate) > 1) {
      this.registerLink.nativeElement.classList.add('disabled-link');
      this.register2Link.nativeElement.classList.add('disabled-link');
      return true;
    }
    return false;
  }
}
