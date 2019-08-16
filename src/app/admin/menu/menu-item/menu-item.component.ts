import { Component, Inject } from '@angular/core';
import { MenuModel } from 'src/app/shared/models/menu.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.scss']
})
export class MenuItemComponent {
  constructor(
    private dialogRef: MatDialogRef<MenuItemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MenuModel) { }

  onCancel(): void {
    this.dialogRef.close();
  }
}
