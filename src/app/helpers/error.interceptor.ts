import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  private isRefreshing: boolean = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private authService: AuthService
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status == 403) {
        this.authService.logout();
        return throwError(() => new Error('Access denied.'));
      } else if (err.status == 401) {
        if (request.url.endsWith('api/token/')) {
          return throwError(() => 'Invalid credentials.');
        } else {
          return this.handle401Error(request, next);
        }
      }
      
      const error = err.error.message || err.statusText;
      return throwError(() => new Error(error));
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.authService.tokenValue;

      if (token) {
        return this.authService.refreshToken().pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;

            this.refreshTokenSubject.next(token.access_token);
            
            return next.handle(this.addTokenHeader(request, token.access_token));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            
            this.authService.logout();
            return throwError(() => new Error(err));
          })
        );
      }

      this.authService.logout();
      return throwError(() => new Error('Token not found...'));
    }

    return next.handle(request);
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
