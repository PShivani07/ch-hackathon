import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthenticationService } from 'src/app/core/authentication.service';

@Injectable()
export class MessageService {
  private msgurl = 'https://webexapis.com/v1/messages';
  media: any = [];
  public statusCode: number = 200;

  accessKey: any;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { 
    this.accessKey = authenticationService.currentUserValue.toString().replace(/['"]+/g, '');
  }

  sendMsg(msg: string, rooms: any): number{
    for(var i=0; i<rooms.length; i++) {
      this.media.push({
        'roomId': rooms[i],
        'text': msg
      });
      console.log(this.media[i]);
      
      this.http.post(this.msgurl, JSON.stringify( this.media[i] ), {
        headers: new HttpHeaders({
          "Authorization": `Bearer ${this.accessKey}`,
          "Content-Type": "application/json"
        }),
        observe: 'response'
      }).subscribe(value => {
        console.log("inside message service" + value.status);
        this.statusCode = value.status;
      });
    }
    this.media = [];
    return this.statusCode;
  }
}
