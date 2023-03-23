import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) {}

  //* checks if user is logged in (checks JWT token)
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree {

    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      return true;
    } else {
      return this.router.parseUrl('/login');
    }
  }

}
