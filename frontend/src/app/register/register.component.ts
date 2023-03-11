import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z-]{0,16}$'), Validators.minLength(2), Validators.maxLength(16)]),
    lastName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z-]{0,32}$'), Validators.minLength(3), Validators.maxLength(32)]),
    houseNumber: new FormControl('', [Validators.required, Validators.pattern('^[1-9][0-9]{0,5}$'), Validators.minLength(1), Validators.maxLength(6), Validators.min(1)]),
    address: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z -]{0,64}$'), Validators.minLength(5), Validators.maxLength(64)]),
    city: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z-]{0,16}$'), Validators.minLength(2), Validators.maxLength(16)]),
    county: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z-]{0,16}$'), Validators.minLength(2), Validators.maxLength(16)]),
    postCode: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9]{0,8}$'), Validators.minLength(2), Validators.maxLength(16)]),
    phoneNumber: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{0,16}$'), Validators.minLength(9), Validators.maxLength(16)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(128)]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(64)]),
  });

  constructor(private http: HttpClient, private router: Router) {}


  registerSubmit() {
    const data = this.registerForm.value;
    this.http.post('http://localhost:3000/v1/api/register', data).subscribe(response => {
      console.log(response);
      console.log("User Registered!");
      alert("Success! Thank you for registering!");
      // Handle success
      //this.router.navigate(['/login']);
    }, 
    error => {
      console.error(error);
      // Handle error

      //TODO: Something went wrong => console.alert("Something went wrong try again!");
      alert("Something Went Wrong, Please try again.");
    });
  }
}


