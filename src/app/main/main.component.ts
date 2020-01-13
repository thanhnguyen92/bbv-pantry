import { Component, OnInit } from '@angular/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as english } from './i18n/en';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  constructor(
    private _fuseTranslationLoaderService: FuseTranslationLoaderService) {
    this._fuseTranslationLoaderService.loadTranslations(english);
  }

  ngOnInit() {
  }
}
