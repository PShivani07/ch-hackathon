import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { GroupComponent } from "./group/group.component";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { MeetingComponent } from "./meeting/meeting.component";
import { MemberComponent } from "./member/member.component";
import { MessageComponent } from "./message/message.component";
import { CollectService } from "./services/collect.service";
import { CreateService } from "./services/create.service";
import { MeetService } from "./services/meet.service";
import { MemberService } from "./services/member.service";
import { MessageService } from "./services/message.service";
import { SpaceComponent } from "./space/space.component";
import { CategoryComponent } from './category/category.component';
import { CategoryListComponent } from './category-list/category-list.component';

@NgModule({
    declarations: [
        LoginComponent,
        HomeComponent,
        SpaceComponent,
        MemberComponent,
        MessageComponent,
        MeetingComponent,
        GroupComponent,
        CategoryComponent,
        CategoryListComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [
        CollectService,
        CreateService,
        MeetService,
        MemberService,
        MessageService
    ],
    exports: []
})
export class WebexModule { }