import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, ReplaySubject, tap } from 'rxjs';

import { Broadcast } from '../models/broadcast.model';
import { Message } from '../models/message.model';
import { Rooms } from '../models/rooms.model';

@Injectable()
export class BroadcastService {

  private baseUrl = 'http://localhost:8080/api/broadcast';
  private msgUrl = 'http://localhost:8080/api/messages';
  private roomUrl = 'http://localhost:8080/api/rooms';

  private textMessagesSubject$!: ReplaySubject<Message[]>;
  textMessages$!: Observable<Message[]>;

  constructor(private http: HttpClient) { 
    this.textMessagesSubject$ = new ReplaySubject<Message[]>();
    this.textMessages$ = this.textMessagesSubject$.asObservable();
  }

  getBroadcastList(): Observable<Broadcast[]> {
    return this.http.get<GetBroadcast>(this.baseUrl).pipe(
      map(response => response._embedded.broadcast)
    );
  }

  getBroadcastRooms(id: number): Observable<Rooms[]> {
    const url = this.baseUrl + `/${id}/room`;
    console.log(url);
    return this.http.get<GetRoom>(url).pipe(
      map(response => response._embedded.rooms)
    );
  }

  getBroadcastMsgs(id: number): Observable<Message[]> {
    const url = this.baseUrl + `/${id}/message`;
    console.log(url)

    return this.http.get<GetMsg>(url).pipe(
      map(response => {
        this.textMessagesSubject$.next(response._embedded.messages);
        return response._embedded.messages;
      })
    );
  }

  postMessage(dm: string, id: number, date: number) {
    const url = this.baseUrl + `/${id}`;
    const body = {
      "message": dm,
      "message_BC": url,
      "msgCreated": date
    }
    return this.http.post(this.msgUrl, JSON.stringify(body), { 
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
      observe: 'response'
    })
    // .subscribe(
    //   value => {
    //     console.log("inside post message");
    //     if(value.status == 200 || value.status == 201) {
    //       console.log("success!!");
    //       // window.location.reload();
    //     } else {
    //       console.log("OOPSS!!");
    //     }
    //   }
    // );
  }

  creatBC(name: string, date: number){
    return this.http.post(this.baseUrl, JSON.stringify({ 
      "broadcast_name": name,
      "dateCreated": date
      }), {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
      observe: 'response'
    });
  }

  postBroadcast(rooms: any[], broadcastId: number){
    const roomBC = this.baseUrl + `/${broadcastId}`;

    for(var i=0; i< rooms.length; i++) {
      var body = {
        "roomId": rooms[i].value,
        "title": rooms[i].key,
        "room_BC": roomBC,
      };
      console.log(body);
      this.http.post(this.roomUrl, JSON.stringify(body), {
        headers: new HttpHeaders({
          "Content-Type": "application/json"
        })
      }).subscribe();
    }
  }

  deleteBroadcast(id: number) {
    const url = this.baseUrl + `/${id}`;

    return this.http.delete(url, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
      observe: 'response'
    });
  }
}

  

interface GetBroadcast {
  _embedded: {
    broadcast: Broadcast[];
  }
}

interface GetRoom {
  _embedded: {
    rooms: Rooms[];
  }
}

interface GetMsg {
  _embedded: {
    messages: Message[];
  }
}