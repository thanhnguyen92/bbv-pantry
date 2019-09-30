import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { PublishSubcribeService } from 'src/app/shared/services/publish-subcribe.service';
import { PubSubChannel } from 'src/app/shared/constants/pub-sub-channel.constant';

@Component({
  selector: 'app-section-selection',
  templateUrl: './section-selection.component.html',
  styleUrls: ['./section-selection.component.scss']
})
export class SectionSelectionComponent {
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private pubSubService: PublishSubcribeService) {
    this.pubSubService.subscribe(PubSubChannel.IS_USER_LOGGED, res => {
      if (!res) {
        this.dialogRef.close();
      }
    });
  }

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
