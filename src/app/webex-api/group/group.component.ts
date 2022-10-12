import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { CollectService } from 'src/app/webex-api/services/collect.service';
import { MemberService } from 'src/app/webex-api/services/member.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit, OnDestroy {
  leaderGroup: any =[];
  groups: any =[];
  showMsg: boolean = false;
  submit: boolean = false;
  msg: string = '';

  // Subscription
  cs_collect!: Subscription;

  @ViewChild('mailID') mailId!: ElementRef;

  constructor(
    private collectService: CollectService,
    private memberService: MemberService
    ) { }

  ngOnInit(): void {
    this.displayGroup()
  }

  displayGroup() {
    this.cs_collect = this.collectService.collect().subscribe(result => {
      Object.values(result)[0].forEach((i: { [x: string]: any; }) => 
        {
          if (i['type'] == "group") {
            this.leaderGroup = [...this.leaderGroup, { key: i['title'], value: i['id'] }];
            this.groups = [...this.groups, { key: i['title'], value: i['id'] }];
          }
        });
      });
    }

  get selectedLeader() {
    return this.leaderGroup.filter((room: { checked: any; }) => room.checked).map((room: { value: any; }) => room.value);
  }
  get selectedRooms() {
    return this.groups.filter((room: { checked: any; }) => room.checked).map((room: { value: any; }) => room.value);
  }

  merge() {
    // this.memberService.mergeGroup(this.selectedRooms, this.selectedLeader);
    this.submit = true;
    if(this.selectedLeader.length > 1) {
      this.msg = "Select one main group";
    } else if(this.selectedLeader.length != 1) {
      this.msg = "Main group not selected";
    } else if(this.selectedRooms.length === 0) {
      this.msg = "Select atleast one group to merge";
    } else {
      const status = Number(this.memberService.demo(this.selectedRooms, this.selectedLeader));
      if(status) {
        this.submit = false;
        this.showMsg = true;
        this.msg = '';
      }
    }
  }

  ngOnDestroy(): void {
    if(this.cs_collect) {
      this.cs_collect.unsubscribe();
    }
  }
}
