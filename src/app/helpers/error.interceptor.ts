import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';

import { AuthenticationService } from 'src/app/core/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry(1),
      catchError((err: HttpErrorResponse) => {
        var errorMessage = '';

        if (err.error instanceof ErrorEvent) {
          // client-side error
          errorMessage = err.error.message;
        } else {
          // server-side error
          errorMessage = `${err.status}\nMessage: ${err.message}`;
          if (err.status === 401) {
            // auto logout if 401 response returned from api
            this.authenticationService.logout();
            location.reload();
          }
        }
        if (err.status === 409) {
          // pass as the member is already present in the group
          // window.alert("Member already exists");
        } else {
          window.alert(errorMessage);
        }
        return throwError(() => errorMessage);
      }));
  }
}
