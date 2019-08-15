import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-section-selection',
  templateUrl: './section-selection.component.html'
})
export class SectionSelectionComponent {
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router) { }

  onCancel(): void {
    this.dialogRef.close();
  }

  goToAdmin() {
    this.router.navigate(['admin']);
    this.dialogRef.close();
  }

  goToUser() {
    this.router.navigate(['user']);
    this.dialogRef.close();
  }
}
