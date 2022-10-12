import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable()
export class AuthenticationService {
  // BehaviourSubject holds current value & emits to any new subscribers as soon as they subscribe
  private currentUserSubject!: BehaviorSubject<any>;
  public currentUser!: Observable<any>;
  private authUrl = 'https://webexapis.com/v1/rooms';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { 
    this.currentUserSubject = new BehaviorSubject<any>(localStorage.getItem('currentUser') || '');
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // access currentUser object without subscribing 
  get currentUserValue(): Observable<any>{
    return this.currentUserSubject.value;
  }

  login(accessToken: string) {
    return this.http.get(this.authUrl, {
      headers: new HttpHeaders({
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      })
    }).pipe(map(user => {
      // store user access token in local storage to keep user logged in between page refreshes
      localStorage.setItem('currentUser', JSON.stringify(accessToken));
      this.currentUserSubject.next(user);
      return user;
    })).subscribe(
      data => {
        this.router.navigate(['/home']);
        window.location.reload();
        return data;
      }
    );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
