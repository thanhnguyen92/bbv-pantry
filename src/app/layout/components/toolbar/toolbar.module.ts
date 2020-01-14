import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { ToolbarComponent } from 'app/layout/components/toolbar/toolbar.component';
import { MatTooltipModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    declarations: [
        ToolbarComponent
    ],
    imports: [
        // Angular modules
        RouterModule,
        TranslateModule,

        // Mat modules
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        MatTooltipModule,

        // Fuse modules
        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule
    ],
    exports: [
        ToolbarComponent
    ]
})
export class ToolbarModule {
}
