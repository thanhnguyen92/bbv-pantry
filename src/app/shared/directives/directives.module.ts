import { ModuleWithProviders, NgModule } from '@angular/core';

// Directives
import { CheckPermissionDirective } from './check-permission.directive';

const DIRECTIVES = [
    CheckPermissionDirective
];

@NgModule({
    declarations: [
        DIRECTIVES
    ],
    exports: [
        DIRECTIVES
    ]
})

export class DirectivesModule {
    static forRoot(): ModuleWithProviders {
        return { ngModule: DirectivesModule };
    }
}
