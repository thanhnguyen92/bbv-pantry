import { NgModule } from '@angular/core';
import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';

@NgModule({
    imports: [
        TranslateModule,
        FuseSharedModule,
        MainRoutingModule
    ],
    declarations: [
        MainComponent
    ],
    exports: [MainComponent],
    bootstrap: [MainComponent]
})
export class MainModule { }
