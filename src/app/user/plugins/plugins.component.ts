import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PluginItemComponent } from './plugin-item/plugin-item.component';
import { finalize } from 'rxjs/operators';
import { Utilities } from 'src/app/shared/services/utilities';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { PluginModel } from 'src/app/shared/models/plugin.model';
import { PluginService } from 'src/app/shared/services/plugin.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-plugins',
  templateUrl: './plugins.component.html',
  styleUrls: ['./plugins.component.scss']
})
export class PluginsComponent implements OnInit {
  url = '';
  constructor(
    private dialog: MatDialog,
    private pluginService: PluginService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.url = params['url'] || '';
    });
  }

  ngOnInit() {}

  showPopupAddPlugin() {
    this.dialog.closeAll();
    const diaLogRef = this.dialog.open(PluginItemComponent, {
      width: '250px',
      data: {},
      hasBackdrop: false
    });

    const dialogSubscription = diaLogRef
      .afterClosed()
      .pipe(finalize(() => Utilities.unsubscribe(dialogSubscription)))
      .subscribe((data: PluginModel) => {
        if (data) {
          let service;
          if (data.id) {
            service = this.pluginService.update({ ...data });
          } else {
            service = this.pluginService.add({
              ...data
              // ...{ restaurantId: this.restaurantId }
            });
          }
          service
            .then(() => {
              NotificationService.showSuccessMessage('Save successful');
            })
            .catch(() => {
              NotificationService.showErrorMessage('Save failed');
            });
        }
      });
  }
}
