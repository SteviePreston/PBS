import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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

export class LoginComponent implements OnInit{

  loginForm!: FormGroup;

  constructor(private http: HttpClient, private router: Router, private formbuilder: FormBuilder) {}

  ngOnInit(){

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
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }


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