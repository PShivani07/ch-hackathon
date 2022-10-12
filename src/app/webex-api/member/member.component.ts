import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { CollectService } from 'src/app/webex-api/services/collect.service';
import { MemberService } from 'src/app/webex-api/services/member.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit, OnDestroy {
  rooms: any =[];
  showMsg: boolean = false;
  errMsg: boolean = false;
  msg: string = '';

  // Subscription
  cs_collect!: Subscription;
  ms_member!: Subscription;

  @ViewChild('mailID') mailId!: ElementRef;

  constructor(
    private collectService: CollectService,
    private memberService: MemberService
    ) { }

  ngOnInit(): void {
    this.display()
  }

  display() {
    this.cs_collect = this.collectService.collect().subscribe(
      result => Object.values(result)[0].forEach((i: { [x: string]: any; }) => this.rooms = [...this.rooms, { value: i['id'], key: i['title']}] )
    );
  }

  get selectedRoom() {
    return this.rooms.filter((room: { checked: any; }) => room.checked).map((room: { value: any; }) => room.value);
  }

  member() {
    const mail = this.mailId.nativeElement.value;
    if(this.selectedRoom.length == 0){
      this.errMsg = true;
      this.msg = 'Select space to add';
    } else if (this.selectedRoom.length > 1) {
      this.errMsg = true;
      this.msg = 'Select only one space. For adding to more spaces use merge feature.';
    } else if(mail == '') {
      this.errMsg = true;
      this.msg = 'Enter member email address to add';
    } else {
      this.ms_member = this.memberService.addMember(this.selectedRoom, mail, false)
        .subscribe(value => {
          if( value.status === 200 || value.status === 201 ){
            this.showMsg = true;
            this.errMsg = false;
            this.msg = '';
          } else {
            this.msg = 'Failed! Enter valid Email-address';
          }
        });
    }
  }

  ngOnDestroy(): void {
    if(this.cs_collect) {
      this.cs_collect.unsubscribe();
    }
    if(this.ms_member) {
      this.ms_member.unsubscribe();
    }
  }
}
