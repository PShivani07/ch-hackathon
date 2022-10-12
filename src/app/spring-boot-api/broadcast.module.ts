import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AuthGuard } from "../helpers/auth.guard";

import { OrderByPipe } from "../helpers/order-by.pipe";
import { BroadcastDetailComponent } from "./broadcast-detail/broadcast-detail.component";
import { BroadcastListComponent } from "./broadcast-list/broadcast-list.component";
import { BroadcastService } from "./broadcast.service";
import { BroadcastComponent } from "./broadcast/broadcast.component";

@NgModule({
    declarations: [
        BroadcastListComponent,
        BroadcastComponent,
        BroadcastDetailComponent,
        OrderByPipe
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: BroadcastListComponent, canActivate: [AuthGuard] },
            { path: ':id', component: BroadcastDetailComponent, canActivate: [AuthGuard] },
        ]),
        FormsModule,
    ],
    providers: [
        BroadcastService
    ],
    exports: []
})
export class BroadcastModule { }