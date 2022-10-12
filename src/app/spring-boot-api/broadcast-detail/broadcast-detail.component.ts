import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Message } from 'src/app/models/message.model';
import { Rooms } from 'src/app/models/rooms.model';

import { BroadcastService } from 'src/app/spring-boot-api/broadcast.service';
import { MessageService } from 'src/app/webex-api/services/message.service';

@Component({
  selector: 'app-broadcast-detail',
  templateUrl: './broadcast-detail.component.html',
  styleUrls: ['./broadcast-detail.component.css']
})
export class BroadcastDetailComponent implements OnInit, OnDestroy {

  rooms!: Rooms[];
  texts!: Message[];
  id: number = Number(this.route.snapshot.paramMap.get('id'));
  userInput: string = '';

  // Subscriptions
  bs_textMsg!: Subscription;
  bs_room!: Subscription;
  bs_msg!: Subscription;
  bs_postMsg!: Subscription;

  constructor(
    private broadcastService: BroadcastService,
    private route: ActivatedRoute,
    private messageService: MessageService
    ) {
      var box = document.getElementById('chat-content');
      box?.scrollTop != box?.scrollHeight;
    }

  ngOnInit(): void {
    this.room(this.id);
    this.messages(this.id);

    this.bs_textMsg = this.broadcastService.textMessages$.subscribe(data => this.texts = [...data]);
  }

  room(id: number) {
    this.bs_room = this.broadcastService.getBroadcastRooms(id).subscribe( data => this.rooms = [...data] );
  }

  messages(id: number) {
    this.bs_msg = this.broadcastService.getBroadcastMsgs(id).subscribe();
  }

  sendMsg() {
    const msg = this.userInput;
    this.userInput = '';
    const date = Date.now();
    const roomIds = this.rooms.map((room: { [x: string]: any; }) => room["roomId"]);
    
    this.messageService.sendMsg(msg, roomIds);
    this.bs_postMsg = this.broadcastService.postMessage(msg, this.id, date).subscribe( value => this.ngOnInit() );
  }

  ngOnDestroy(): void {
    if(this.bs_textMsg) {
      this.bs_textMsg.unsubscribe();
    }
    if(this.bs_room) {
      this.bs_room.unsubscribe();
    }
    if(this.bs_msg) {
      this.bs_msg.unsubscribe();
    }
    if(this.bs_postMsg) {
      this.bs_postMsg.unsubscribe();
    }
  }
}
