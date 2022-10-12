import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";

import { AuthenticationService } from "./authentication.service";

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule
    ],
    providers: [
        AuthenticationService
    ],
    exports: []
})
export class CoreModule { }