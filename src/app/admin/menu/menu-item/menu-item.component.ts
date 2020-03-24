import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/** Models */
import { MenuModel } from 'app/shared/models/menu.model';

/** Services */
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

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
