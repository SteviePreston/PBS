import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent {
  userIsAdmin = false;
  constructor(private http: HttpClient, private router: Router){}

  async isAdmin() {
    const token = localStorage.getItem('token') as string;
    const decodedtoken  = jwt_decode(token) as any;
    const email = decodedtoken.email;
    const apiPath = 'http://localhost:3000/v1/api/admin/';

    this.http.get(apiPath + email).subscribe(response => {
    this.userIsAdmin = response == true; 
    console.log(this.userIsAdmin);

     }, errors=>{
        console.error(errors);
        this.router.navigate(['/login']);
        alert("Login has expired!, Please login again");
     }
     );
  }

  logout() {
    localStorage.removeItem("token");
    this.router.navigate(['/login']);
  }

}
