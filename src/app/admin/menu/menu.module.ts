import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { MenuRoutingModule } from './menu-routing.module';
import { FormsModule } from '@angular/forms';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MenuService } from 'src/app/shared/services/menu.service';
import { RestaurantSelectionComponent } from './restaurant-selection/restaurant-selection.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { FileUploadModule } from 'ng2-file-upload';
import { Cloudinary as CloudinaryCore } from 'cloudinary-core';
const cloudinaryLib = {
  Cloudinary: CloudinaryCore
};
@NgModule({
  declarations: [
    MenuComponent,
    MenuItemComponent,
    RestaurantSelectionComponent
  ],
  entryComponents: [MenuItemComponent, RestaurantSelectionComponent],
  imports: [
    CommonModule,
    MenuRoutingModule,
    FormsModule,
    AngularFirestoreModule,
    MaterialModule,
    CloudinaryModule.forRoot(cloudinaryLib, {
      cloud_name: 'bbvpantry',
      upload_preset: 'gc0j1yzf'
    }),
    FileUploadModule
  ],
  providers: [MenuService]
})
export class MenuModule {}
