import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '@environments/environment';

const TOKEN_NAME = environment.tokenName;

export const authGuard: CanActivateFn = (route, state) => {
  if (localStorage.getItem(TOKEN_NAME))
    return true;

  const router: Router = inject(Router);
  router.navigate(["/login"], { queryParams : { returnUrl: state.url }});

  return false;
};
