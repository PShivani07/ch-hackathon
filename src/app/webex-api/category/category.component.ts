import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { BroadcastService } from 'src/app/spring-boot-api/broadcast.service';
import { CollectService } from 'src/app/webex-api/services/collect.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  rooms: any = [];
  showMsg: boolean = false;
  errMsg: boolean = false;
  msg: string = '';

  // Subscriptions
  cs_collect!: Subscription;
  bc_create!:Subscription;

  @ViewChild('title') title!: ElementRef;

  constructor(
    private collectService: CollectService,
    private broadcastService: BroadcastService
  ) { }
  
  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.cs_collect = this.collectService.collect().subscribe((result => {
      // Immutability
      Object.values(result)[0].forEach((element: { [x: string]: any; }) => 
        this.rooms = [...this.rooms, { value: element['id'], key: element['title']}]
      );
    }));
  }

  get SelectedRooms() {
    return this.rooms.filter((room: { checked: any; }) => room.checked);
  }

  createBroadcast(){
    if(this.title.nativeElement.value == '') {
      this.errMsg = true;
      this.msg = 'Please enter a title';
    } else if(this.SelectedRooms.length == 0) {
      this.errMsg = true;
      this.msg = 'Select atleast one space to create a broadcast';
    } else {
      const date = Date.now();
      this.bc_create = this.broadcastService.creatBC(this.title.nativeElement.value, date).subscribe( response => {
        if(response.status == 200 || response.status == 201){
          var id = Object(response.body)['id'];
          
          this.broadcastService.postBroadcast(this.SelectedRooms, id);
          this.showMsg = true;
          this.errMsg = false;
        } 
      });
    }
  }

  ngOnDestroy(): void {
    if(this.cs_collect) {
      this.cs_collect.unsubscribe();
    }
    if(this.bc_create) {
      this.bc_create.unsubscribe();
    }
  }

}
