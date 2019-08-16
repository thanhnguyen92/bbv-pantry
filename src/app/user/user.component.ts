import { Component, OnInit } from '@angular/core';
import { MenuModel } from '../shared/models/menu.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  currentDate = new Date();
  menu: MenuModel[] = [];

  constructor() { }

  ngOnInit() {
    
  }
}
