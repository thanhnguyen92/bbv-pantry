import { Component, OnInit, Inject } from '@angular/core';
import { Menu } from 'src/app/shared/models/menu.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { inject } from '@angular/core/testing';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent implements OnInit {
  data: Menu = {} as Menu;
  constructor(
    private dialogRef: MatDialogRef<MenuItemComponent>,
    @Inject(MAT_DIALOG_DATA) data: Menu
  ) {}

  ngOnInit() {}

  onCancel(): void {
    this.dialogRef.close();
  }
}
