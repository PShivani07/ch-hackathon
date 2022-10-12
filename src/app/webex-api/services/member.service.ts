import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthenticationService } from 'src/app/core/authentication.service';

@Injectable()
export class MemberService {
  accessKey: any;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { 
    this.accessKey = authenticationService.currentUserValue.toString().replace(/['"]+/g, '');
  }
  private memberUrl = 'https://webexapis.com/v1/memberships';

  addMember(room :any, emailId :string, isModerator: boolean) {
    return this.http.post(this.memberUrl, JSON.stringify( {
      "roomId": room[0],
      "personEmail": emailId,
      "isModerator": isModerator
    } ), {
      headers: new HttpHeaders({
        "Authorization": `Bearer ${this.accessKey}`,
        "Content-Type": "application/json"
      }),
      observe: 'response'
    });
  }

  // merge group
  mailer_list: any= new Set();
  status = 1;

  demo(groups: any[], roomId: any) {
    for(var i=0; i<groups.length; i++) {
      const result$ = this.http.get(this.memberUrl + `?roomId=${groups[i]}`,
        {
          headers: new HttpHeaders({
            "Authorization": `Bearer ${this.accessKey}`,
            "Content-Type": "application/json"
          })
        })
        .subscribe(result => Object.values(result)[0].forEach((_id: any) => {
            if (this.mailer_list.has(_id['personEmail']) == false) {
              this.mailer_list.add(_id['personEmail']);
              this.addMember(roomId, _id['personEmail'], false).subscribe(value => {
                if( value.status === 200 || value.status === 409){
                  this.status = 0;
                  console.log('Member successfully added.');
                } else {
                  console.log('Member is not added. Try again.');
                }
              });
            }
      }));
    }
    return this.status;
  }

  // groups is a list of room ids
  mergeGroup(groups: any[], roomId: any) {
    // generate mailer list
    for(var i=0; i<groups.length; i++) {
      this.http.get(this.memberUrl + `?roomId=${groups[i]}`,
        {
          headers: new HttpHeaders({
            "Authorization": `Bearer ${this.accessKey}`,
            "Content-Type": "application/json"
          })
        }).subscribe(data => {
          console.log("email address");
          console.log(data);
          Object.values(data)[0].forEach((_id: any) => {
            if (_id['personEmail']) {
              this.mailer_list.add(_id['personEmail']);
            }
          });
          console.log(this.mailer_list);
        }); 
    }

    console.log("***wrong timing****");

    for(var i=0; i<this.mailer_list.length; i++) {
      console.log("inside mailer list");
      this.addMember(roomId, this.mailer_list[i], false).subscribe(value => {
        if( value.status === 200){
          console.log('Member successfully added.');
        } else {
          console.log('Member is not added. Try again.');
        }
      });
    }
  }
}
