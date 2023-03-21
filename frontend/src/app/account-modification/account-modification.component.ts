import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';

interface Customer {
  address: string;
  city: string;
  county: string;
  customerID: string;
  houseNumber: string;
  phoneNumber: string;
  postCode: string;
}

interface ApiResponse {
  message: string;
  data: Customer[];
}


@Component({
  selector: 'app-account-modification',
  templateUrl: './account-modification.component.html',
  styleUrls: ['./account-modification.component.css']
})
export class AccountModificationComponent {
  customerData = {
    address:"",
    city:"",
    county:"",
    customerID:"",
    houseNumber:"",
    phoneNumber:"",
    postCode:"",
  };
  
  accountForm!: FormGroup;
  constructor(private http: HttpClient, private router: Router, private formbuilder: FormBuilder) {}

  
  async getAccountDetails() {
    
    const token = localStorage.getItem('token') as string;
    const decodedtoken  = jwt_decode(token) as any;
    const email = decodedtoken.email;

    //TODO: change to our own API request
    const apiPath = 'http://localhost:3000/v1/api/account/';

    this.http.get<ApiResponse>(apiPath + email).subscribe(
      (response) => {
        console.log(response);
        this.customerData.address = response.data[0].address;
        this.customerData.city = response.data[0].city;
        this.customerData.county = response.data[0].county;
        this.customerData.customerID = response.data[0].customerID;
        this.customerData.houseNumber = response.data[0].houseNumber;
        this.customerData.phoneNumber = response.data[0].phoneNumber;
        this.customerData.postCode = response.data[0].postCode;
        
      },
      (errors) => {
        console.error(errors);
      }
    );
  }

  ngOnInit() {

  this.getAccountDetails();
    
  this.accountForm = this.formbuilder.group({

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
    ]]

} )
  }

  get houseNumber() {
    return this.accountForm.get('houseNumber');
  }

  get address() {
    return this.accountForm.get('address');
  }

  get city() {
    return this.accountForm.get('city');
  }

  get county() {
    return this.accountForm.get('county');
  }

  get postCode() {
    return this.accountForm.get('postCode');
  }

  get phoneNumber() {
    return this.accountForm.get('phoneNumber');
  }

  modificationSubmit() {
    const token = localStorage.getItem('token') as string;
    const decodedtoken  = jwt_decode(token) as any;
    const email = decodedtoken.email;

    const data = this.accountForm.value;

    //const apiPath = 'http://localhost:3000/v1/api/account/';


    this.http.put('http://localhost:3000/v1/api/account/' + email, data ).subscribe(response => {
      console.log(response);
      console.log("Details Modified!");
      alert("Details Modified!");
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
