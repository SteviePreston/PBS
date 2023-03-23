import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

interface LoginResponse {
  token: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit{

  loginForm!: FormGroup;

  constructor(private http: HttpClient, private router: Router, private formbuilder: FormBuilder, public HeaderComponent: HeaderComponent) {}

  ngOnInit(){

    //* Validates and sanitises the input data using email, min and max length validatiors
    this.loginForm = this.formbuilder.group({
        email: ['', [
          Validators.required,
          Validators.email,
          Validators.minLength(10),
          Validators.maxLength(128)
        ]],
        password: ['', [
          Validators.required,
          // Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'), //! should add this?
          Validators.minLength(8),
          Validators.maxLength(64)

        ]],
    })

    // Listen to route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/home') {
        window.location.reload();
      }
    });
  }


  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }


  //* Sends the login form data to the api endpoint in server.js, handles the error and success
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

        this.router.navigate(['/home']);

      },
      (error) => {
        console.error(error);
        // Display error message
        alert('Invalid email or password. Please try again.');
      }
    );
  }
  
}