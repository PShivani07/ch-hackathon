import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { CollectService } from 'src/app/webex-api/services/collect.service';
import { MessageService } from 'src/app/webex-api/services/message.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit, OnDestroy {
  rooms: any = [];
  statusCode!: number;
  showMsg: boolean = false;
  errMsg: boolean = false;
  error: string = '';

  // Subscription
  cs_collect!: Subscription;

  @ViewChild('message') message!: ElementRef;

  constructor(
    private collectService: CollectService,
    private messageService: MessageService
    ) { }

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.cs_collect = this.collectService.collect().subscribe((result =>
      Object.values(result)[0].forEach((i: { [x: string]: any; }) => this.rooms = [...this.rooms, { value: i['id'], key: i['title']}])
    ));
  }

  get SelectedRooms() {
    return this.rooms.filter((room: { checked: any; }) => room.checked).map((room: { value: any; }) => room.value);
  }

  postMsg() {
    const msg = this.message.nativeElement.value;
    if(msg == '') {
      this.errMsg = true;
      this.error = 'Please enter message to sent';
    } else if(this.SelectedRooms == 0) {
      this.errMsg = true;
      this.error = 'Select spaces to send message';
    } else {
      this.messageService.sendMsg(msg, this.SelectedRooms);
      this.statusCode = this.messageService.statusCode;
      if(this.statusCode === 200) {
        this.showMsg = true;
        this.errMsg = false;
      }
    }
  }

  ngOnDestroy(): void{
    if(this.cs_collect) {
      this.cs_collect.unsubscribe();
    }
  }
}
