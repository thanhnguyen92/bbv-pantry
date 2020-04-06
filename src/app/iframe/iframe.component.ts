import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-iframe',
  templateUrl: './iframe.component.html',
  styleUrls: ['./iframe.component.scss']
})
export class IframeComponent implements OnInit {
  // tslint:disable-next-line: max-line-length
  sourceURL = 'https://www.google.com/';

  constructor(private _dialog: MatDialog) { }

  ngOnInit() {
    // const dialogRef = this._dialog.open(ConfirmDialogComponent, {
    //   width: '350px',
    //   data: { title: 'URL iFrame', noButton: 'BUTTON.CANCEL', yesButton: 'BUTTON.OK' }
    // });

    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     console.log('afterClosed', res);
    //     this.sourceURL = res.input;
    //   }
    // });
  }
}
