import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { Broadcast } from 'src/app/models/broadcast.model';
import { BroadcastService } from 'src/app/spring-boot-api/broadcast.service';

@Component({
  selector: 'app-broadcast-list',
  templateUrl: './broadcast-list.component.html',
  styleUrls: ['./broadcast-list.component.css']
})
export class BroadcastListComponent implements OnInit, OnDestroy {

  public broadcasts: Broadcast[] = [];

  // Subscriptions
  bc_getList!: Subscription;
  bc_delete!: Subscription;

  constructor(private broadcastService: BroadcastService) { }

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
  
  ngOnDestroy(): void {
    if(this.bc_getList) {
      this.bc_getList.unsubscribe();
    }
    if(this.bc_delete) {
      this.bc_delete.unsubscribe();
    }
  }
}
