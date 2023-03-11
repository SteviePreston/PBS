import { Component} from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(128)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8),Validators.maxLength(64)]),
  });

  constructor(private http: HttpClient, private router: Router) {}


  loginSubmit() {
    const data = this.loginForm.value;
    this.http.post<LoginResponse>('http://localhost:3000/v1/api/login', data).subscribe(
      (response) => {
        // console.log(response);
        // Store token in local storage
        const token = response.token;
        // console.log(token);
        localStorage.setItem('token', token);
        alert("Thank you for logging in!");
        // Redirect to homepage
        this.router.navigate(['/admin']);
      },
      (error) => {
        console.error(error);
        // Display error message
        alert('Invalid email or password. Please try again.');
      }
    );
  }
  
}