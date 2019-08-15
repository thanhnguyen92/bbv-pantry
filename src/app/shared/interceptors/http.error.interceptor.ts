import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((response: any) => {
        if (response instanceof HttpErrorResponse) {
          if (response.status === 401) {
            this.router.navigate(['auth', 'login']);
          }

          // Show error message when HTTP Status Code smaller 600
          // Another error by validation logic will be larger than 600 and be handled by the called service
          if (response.status < 600 && response.error) {
            // this.dialogService.openAlert({
            //   title: 'Error',
            //   message: response.error.error
            //     ? response.error.error
            //     : 'There is something wrong, please wait a moment and try again.'
            // });
            window.alert(
              'There is something wrong, please wait a moment and try again.'
            );
          }
        }

        return throwError(response);
      })
    );
  }
}
