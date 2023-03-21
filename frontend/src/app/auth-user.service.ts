import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'
import jwt_decode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {
  private _userIsAdmin = new BehaviorSubject<boolean>(false);
  private _isLoggedIn = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private router: Router) {
    this._isLoggedIn.next(this.checkLoggedIn());
  }

  private checkLoggedIn(): boolean {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      return true;
    } else {
      return false;
    }
  }
  
  async checkAdmin() {
    const token = localStorage.getItem('token') as string;
    const decodedtoken  = jwt_decode(token) as any;
    const email = decodedtoken.email;
    const apiPath = 'http://localhost:3000/v1/api/admin/';

    this.http.get(apiPath + email).subscribe(response => {
      this._userIsAdmin.next(response == true);
      console.log(this._userIsAdmin.value);

     }, errors=>{
        console.error(errors);
        this.router.navigate(['/login']);
        alert("Login has expired!, Please login again");
     }
    );
  }

  logout() {
    localStorage.removeItem('token');
    this._userIsAdmin.next(false);
    this.router.navigate(['/login']);
    console.log("checking admin:");
    console.log(this._userIsAdmin.value);
  }

  get userIsAdmin() {
    return this._userIsAdmin.asObservable();
  }

  get isLoggedIn() {
    return this._isLoggedIn.asObservable();
  }
}
