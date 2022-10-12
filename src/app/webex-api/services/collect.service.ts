import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';

import { AuthenticationService } from 'src/app/core/authentication.service';

@Injectable()
export class CollectService {
  accessKey: any;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { 
    this.accessKey = authenticationService.currentUserValue.toString().replace(/['"]+/g, '');
  }

  private roomsUrl = 'https://webexapis.com/v1/rooms';

  collect() {
    return this.http.get(this.roomsUrl, {
      headers: new HttpHeaders({
        "Authorization": `Bearer ${this.accessKey}`,
        "Content-Type": "application/json"
      })
    }).pipe(
      tap(res => {
        console.log(res);
      })
    );
  }
}
