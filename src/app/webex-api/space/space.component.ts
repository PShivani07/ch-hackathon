import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { CreateService } from 'src/app/webex-api/services/create.service';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.css']
})
export class SpaceComponent implements OnInit, OnDestroy {
  
  @ViewChild('title') title!: ElementRef;
  showMsg: boolean = false;
  errMsg: boolean = false;
  msg: String = '';

  // Subscription
  cs_create!: Subscription;

  constructor(
    private createService: CreateService
  ) { }

  createRoom() {
    if(this.title.nativeElement.value == ''){
      this.errMsg = true;
      this.msg = "Enter space name";
    } else {
      this.cs_create = this.createService.create(this.title.nativeElement.value)
        .subscribe((value) => {
          if( value.status === 200){
            this.showMsg = true;
            this.errMsg = false;
            this.msg = '';
          }
        });
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if(this.cs_create) {
      this.cs_create.unsubscribe();
    }
  }
}
