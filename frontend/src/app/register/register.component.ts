import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  registerForm!: FormGroup;

  constructor(private http: HttpClient, private router: Router, private formbuilder: FormBuilder) {}

  ngOnInit() {

    this.registerForm = this.formbuilder.group({
      firstName: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z-]{0,16}$'),
        Validators.minLength(2),
        Validators.maxLength(16),
      ]],
      lastName: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z -]{0,32}$'),
        Validators.minLength(3),
        Validators.maxLength(32),
      ]],
      houseNumber: ['', [
        Validators.required,
        Validators.pattern('^[1-9][0-9]{0,5}$'),
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.min(1),
      ]],
      address: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z -]{0,64}$'),
        Validators.minLength(5),
        Validators.maxLength(64),
      ]],
      city: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z-]{0,16}$'), 
        Validators.minLength(2), 
        Validators.maxLength(16),
      ]],
      county: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z-]{0,16}$'), 
        Validators.minLength(2), 
        Validators.maxLength(16),
      ]],
      postCode: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9]{0,8}$'), 
        Validators.minLength(2), 
        Validators.maxLength(16),
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('^[0-9]{0,16}$'), 
        Validators.minLength(9), 
        Validators.maxLength(16),
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.minLength(10),
        Validators.maxLength(128),
      ]],
      password: ['', [
        Validators.required,
        // Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'), //! should add this?
        Validators.minLength(8), 
        Validators.maxLength(64),
      ]],
      confirmPassword: ['', [
        Validators.required,
      ]],
  }, { validator: RegisterComponent.passwordMatchValidator })
  }

  static passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password?.value !== confirmPassword?.value) {
      if (confirmPassword) {
        confirmPassword.setErrors({ 'mismatch': true });
      }
      return { 'mismatch': true };
    } else {
      if (confirmPassword) {
        confirmPassword.setErrors(null);
      }
      return null;
    }
  }

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get houseNumber() {
    return this.registerForm.get('houseNumber');
  }

  get address() {
    return this.registerForm.get('address');
  }

  get city() {
    return this.registerForm.get('city');
  }

  get county() {
    return this.registerForm.get('county');
  }

  get postCode() {
    return this.registerForm.get('postCode');
  }

  get phoneNumber() {
    return this.registerForm.get('phoneNumber');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  registerSubmit() {
    const data = this.registerForm.value;
    this.http.post('http://localhost:3000/v1/api/register', data).subscribe(response => {
      console.log(response);
      console.log("User Registered!");
      alert("Success! Thank you for registering!");
      // Handle success
      this.router.navigate(['/login']);
    }, 
    error => {
      console.error(error);
      // Handle error
      alert(error.error.message);
      //TODO: Something went wrong => console.alert("Something went wrong try again!");
      // alert("Something Went Wrong, Please try again.");
    });
  }
}


