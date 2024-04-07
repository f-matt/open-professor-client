import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { JwtToken } from '../models/jwt-token';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
  
const baseUrl = "/api";

const TOKEN_NAME = "openProfessorToken";

@Injectable({
  providedIn: "root"
})
export class AuthService {

  private tokenSubject: BehaviorSubject<JwtToken | null>;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private jwtHelperService: JwtHelperService) { 

    const tokenJson = localStorage.getItem(TOKEN_NAME);
    if (tokenJson) {
      let token = JSON.parse(tokenJson);
      this.tokenSubject = new BehaviorSubject(token);
    } else {
      this.tokenSubject = new BehaviorSubject<JwtToken | null>(null);
    }
  }

  public get tokenValue() {
    const token = this.tokenSubject.value;

    if (token && !this.jwtHelperService.isTokenExpired(token.access_token))
      return token.access_token;

    return null;
  }

  login(username: string, password: string) {
    return this.httpClient.post<JwtToken>(`${baseUrl}/login`, 
      {'username':username, 'password':password})
      .pipe(map(token => {
        localStorage.setItem(TOKEN_NAME, JSON.stringify(token));
        this.tokenSubject.next(token);
        return token;
      }));
  }

  refreshToken() {
    console.log("refresh");
    return this.httpClient.post<JwtToken>(`${baseUrl}/refresh`, 
      {})
      .pipe(map(token => {
        const existingTokenJson = localStorage.getItem(TOKEN_NAME);
        if (existingTokenJson) {
          let existingToken: JwtToken = JSON.parse(existingTokenJson);
          existingToken.access_token = token.access_token;
          localStorage.setItem(TOKEN_NAME, JSON.stringify(existingToken));
          this.tokenSubject.next(existingToken);
          return existingToken;
        }

        return null;
      }));
  }

  logout() {
    localStorage.removeItem(TOKEN_NAME);
    this.tokenSubject.next(null);
    this.router.navigate(['/login']);
  }

  hasPermission(permission: string) {
    try {
      // User without token
      let tokenStr = localStorage.getItem(TOKEN_NAME);
      if (!tokenStr)
        return false;

      let token = JSON.parse(tokenStr);
      if (!token || !token.access_token) 
        return false;

      // Check permission
      const authInfo = JSON.parse(tokenStr);
      const payload = this.jwtHelperService.decodeToken(authInfo.token);

      if (payload.permissions && payload.permissions.indexOf(permission) >= 0)
        return true;
    } catch (e: unknown) {
      if (e instanceof Error)
        throw e;
      else
        throw new Error("Error checking permission.");
    }

    return false;
  }

}
