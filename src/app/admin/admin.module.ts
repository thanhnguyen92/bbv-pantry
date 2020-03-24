import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/** Modules */
import { AdminRoutingModule } from './admin-routing.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatPaginatorModule, MatSortModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatCheckboxModule, MatTooltipModule } from '@angular/material';

/** Components */
import { AdminComponent } from './admin.component';
import { RoleComponent } from './role/role.component';

@NgModule({
    imports: [
        TranslateModule,
        FuseSharedModule,

        // Material
        MatButtonModule,
        MatIconModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MatCheckboxModule,
        MatTooltipModule,

        AdminRoutingModule
    ],
    declarations: [
        AdminComponent,
        RoleComponent
    ],
    bootstrap: [AdminComponent]
})
export class AdminModule { }
