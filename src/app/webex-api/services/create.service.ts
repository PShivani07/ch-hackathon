import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthenticationService } from 'src/app/core/authentication.service';

@Injectable()
export class CreateService {

  accessKey: any;
  private spaceUrl = 'https://webexapis.com/v1/rooms';

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { 
    this.accessKey = authenticationService.currentUserValue.toString().replace(/['"]+/g, '');
  }

  create(roomTitle: string) {
    return this.http.post(this.spaceUrl, JSON.stringify( {
      "title": roomTitle
    } ), {
    headers: new HttpHeaders({
      "Authorization": `Bearer ${this.accessKey}`,
      "Content-Type": "application/json"
      }),
    observe: 'response'
    }
    );
  }
}
