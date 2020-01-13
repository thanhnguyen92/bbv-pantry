import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainComponent } from './main.component';

const appRoutes: Routes = [
    { path: '', component: MainComponent }
    // { path: '**', component: PageNotFoundComponent }
];
@NgModule({
    imports: [
        RouterModule.forChild(
            appRoutes
        )
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
