import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BroadcastDetailComponent } from './spring-boot-api/broadcast-detail/broadcast-detail.component';
import { BroadcastListComponent } from './spring-boot-api/broadcast-list/broadcast-list.component';
import { BroadcastComponent } from './spring-boot-api/broadcast/broadcast.component';
import { GroupComponent } from './webex-api/group/group.component';
import { AuthGuard } from './helpers/auth.guard';
import { HomeComponent } from './webex-api/home/home.component';
import { LoginComponent } from './webex-api/login/login.component';
import { MeetingComponent } from './webex-api/meeting/meeting.component';
import { MemberComponent } from './webex-api/member/member.component';
import { MessageComponent } from './webex-api/message/message.component';
import { SpaceComponent } from './webex-api/space/space.component';
import { CategoryComponent } from './webex-api/category/category.component';
import { CategoryListComponent } from './webex-api/category-list/category-list.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'meeting', component: MeetingComponent, canActivate: [AuthGuard] },
  { path: 'member', component: MemberComponent, canActivate: [AuthGuard] },
  { path: 'message', component: MessageComponent, canActivate: [AuthGuard] },
  { path: 'space', component: SpaceComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'group', component: GroupComponent, canActivate: [AuthGuard] },
  { path: 'broadcast', component: BroadcastComponent, canActivate: [AuthGuard] },
  {
    path: 'broadcast-list',
    loadChildren: () => import('./spring-boot-api/broadcast.module').then( m =>
      m.BroadcastModule)
  },
  { path: 'category', component: CategoryComponent, canActivate: [AuthGuard] },
  { path: 'category-list', component: CategoryListComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo:'/home', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
