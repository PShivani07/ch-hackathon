import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { Broadcast } from 'src/app/models/broadcast.model';
import { BroadcastService } from 'src/app/spring-boot-api/broadcast.service';
import { CollectService } from '../services/collect.service';


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  public broadcasts: Broadcast[] = [];

  // Subscriptions
  bc_getList!: Subscription;
  bc_delete!: Subscription;
  cs_collect!: Subscription;
  bc_room!: Subscription;

  constructor(
    private broadcastService: BroadcastService,
    private collectService: CollectService
    ) { }

  ngOnInit(): void {
    this.broadcast();
  }

  broadcast() {
    this.bc_getList = this.broadcastService.getBroadcastList().subscribe( data => this.broadcasts = [...data] );
  }

  del_broadcast(id: number, name: string) {
    if(confirm("Are you sure to delete "+name)) {
      this.bc_delete = this.broadcastService.deleteBroadcast(id).subscribe( response => window.location.reload());
    }
  }

  room(id: number) {
    this.bc_room = this.broadcastService.getBroadcastRooms(id).subscribe( data => this.rooms = [...data] );
    return this.rooms;
  }
  
  ngOnDestroy(): void {
    if(this.bc_getList) {
      this.bc_getList.unsubscribe();
    }
    if(this.bc_delete) {
      this.bc_delete.unsubscribe();
    }
  }

  rooms: any = [];

  fetch() {
    this.cs_collect = this.collectService.collect().subscribe((result => {
      // Immutability
      Object.values(result)[0].forEach((element: { [x: string]: any; }) => 
        this.rooms = [...this.rooms, { value: element['id'], key: element['title']}]
      );
    }));
  }

}
