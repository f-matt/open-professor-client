import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { JwtToken } from '../models/jwt-token';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '@environments/environment';
import { CustomRuntimeError } from '../errors/custom-runtime-error';
  
const BASE_URL = environment.apiUrl;
const TOKEN_NAME = environment.tokenName;

@Injectable({
  providedIn: "root"
})
export class AuthService {

  private tokenSubject: BehaviorSubject<JwtToken | null> = new BehaviorSubject<JwtToken | null>(null);

  public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private permissions: string[] = [];

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private jwtHelperService: JwtHelperService) { 

    const tokenJson = localStorage.getItem(TOKEN_NAME);
    if (!tokenJson)
      return;

    let token = JSON.parse(tokenJson);
    if (!token)
      return;

    try {
      const payload = this.jwtHelperService.decodeToken(token.access_token);
      this.tokenSubject = new BehaviorSubject(token);
      this.isAuthenticated.next(true);
      if (payload && payload.roles)
        this.permissions = payload.roles;
    } catch (e) {
      this.tokenSubject = new BehaviorSubject<JwtToken | null>(null);
      this.isAuthenticated.next(false);
      this.permissions = [];
      throw new CustomRuntimeError("Error processing authentication token.");
    }

  }

  public get tokenValue() {
    const token = this.tokenSubject.value;

    if (token && !this.jwtHelperService.isTokenExpired(token.accessToken))
      return token.accessToken;

    return null;
  }

  login(username: string, password: string) {
    return this.httpClient.post<JwtToken>(`${BASE_URL}/auth/login`, 
      { username, password })
      .pipe(map(token => {
        localStorage.setItem(TOKEN_NAME, JSON.stringify(token));
        this.tokenSubject.next(token);
        this.isAuthenticated.next(true);
        const payload = this.jwtHelperService.decodeToken(token.accessToken);
        if (payload && payload.roles)
          this.permissions = payload.roles;
        else
          this.permissions = [];

        return token;
      }));
  }

  refreshToken() {
    return this.httpClient.post<JwtToken>(`${BASE_URL}/refresh`, 
      {})
      .pipe(map(token => {
        const existingTokenJson = localStorage.getItem(TOKEN_NAME);
        if (existingTokenJson) {
          let existingToken: JwtToken = JSON.parse(existingTokenJson);
          existingToken.accessToken = token.accessToken;
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
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  hasPermission(permission: string) {
    return this.permissions.includes(permission);
  }

}
