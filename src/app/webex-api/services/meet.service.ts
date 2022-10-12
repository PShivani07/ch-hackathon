import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthenticationService } from 'src/app/core/authentication.service';

@Injectable()
export class MeetService {
  accessKey: any;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService) { 
      this.accessKey = authenticationService.currentUserValue.toString().replace(/['"]+/g, '');
    }

  private meetingUrl = 'https://webexapis.com/v1/meetings';
  requestBody = {};
  invitees: any = [];

  createMeeting(data: any) {
    let formData: FormData = new FormData();
    formData.append('title', data.meetingTitle);
    formData.append('start', data.start);
    formData.append('end', data.end);
    console.log(data.attendees.split(','));

    for(const invite of data.attendees.split(',')) {
      console.log(invite);
      this.invitees.push({
        'email': invite.trim(),
        'displayName': invite,
        'coHost': false
      });
    }

    console.log(this.invitees);

    this.requestBody = {
      'title': data.meetingTitle,
      'start': data.start,
      'end': data.end,
      'invitees': this.invitees
    };

    console.log(formData);
    console.log(JSON.stringify(this.requestBody));

    return this.http.post(this.meetingUrl, JSON.stringify(this.requestBody), {
      headers: new HttpHeaders({
        "Authorization": `Bearer ${this.accessKey}`,
        "Content-Type": "application/json"
      }),
      observe: 'response'
    });
  }
}
