import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import jwt_decode from 'jwt-decode';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

interface booking {
  customerID: string;
  formattedDate: Date;
  bookingTime: string;
  bookingType: string;
  address: string;
  city: string;
  county: string;
  houseNumber: string;
  postCode: string;
}

interface Time {
  value: string;
  viewValue: string;
}

interface ApiResponse {
  message: string;
  data: booking[];
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent {

  bookingForm!: FormGroup;

  minDate: Date;
  maxDate: Date;

  selectedValue?: string;

  times: Time[] = [
    { value: '09:00:00', viewValue: '9 AM' },
    { value: '10:00:00', viewValue: '10 AM' },
    { value: '11:00:00', viewValue: '11 AM' },
    { value: '12:00:00', viewValue: '12 AM' },
    { value: '13:00:00', viewValue: '1 PM' },
    { value: '14:00:00', viewValue: '2 PM' },
    { value: '15:00:00', viewValue: '3 PM' },
    { value: '16:00:00', viewValue: '4 PM' },
    { value: '17:00:00', viewValue: '5 PM' },
  ];

  constructor(private http: HttpClient, private router: Router, private formbuilder: FormBuilder) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const currentDay = new Date().getDate();
    this.minDate = new Date(currentYear, currentMonth, currentDay + 1);
    this.maxDate = new Date(currentYear, currentMonth + 6, currentDay);
  }

  ngOnInit() {

    this.bookingForm = this.formbuilder.group({

      bookingDate: [Date , [
        Validators.required,
        (control: AbstractControl) => {
          const isValidDate = control.value instanceof Date && !isNaN(control.value.getTime());
          return isValidDate ? null : { invalidDate : true };
        }
      ]],
      bookingTime: ['', [
        Validators.required,
      ]],
      bookingType : ['', [
        Validators.required,
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
      ]]
  })
  }

  get bookingDate() { return this.bookingForm.get('bookingDate'); }

  get bookingTime() { return this.bookingForm.get('bookingTime'); }

  get bookingType() { return this.bookingForm.get('bookingType'); }

  get houseNumber() { return this.bookingForm.get('houseNumber'); }

  get address() { return this.bookingForm.get('address'); }

  get city() { return this.bookingForm.get('city'); }

  get county() { return this.bookingForm.get('county'); }

  get postCode() { return this.bookingForm.get('postCode'); }

  
  /*
  getCustomerID() {
    const token = localStorage.getItem('token') as string;
    const decoded = jwt_decode(token) as any;
    const email = decoded.email;

    this.http.get<ApiResponse>('http://localhost:3000/v1/api/customer/' + email).subscribe(response => {
      const customer = response.data[0];
      this.bookingForm.patchValue({
        customerID: customer.customerID,
      });
    });
  }*/


  bookingSubmit() {

    const data = this.bookingForm.value;

    const bookingDate = new Date(data.bookingDate);

    const year = bookingDate.getFullYear();
    const month = bookingDate.getMonth() + 1;
    const day = bookingDate.getDate();
    const formattedDate = `${year}${month.toString().padStart(2, '0')}${day.toString().padStart(2, '0')}`;
    
    // set the formatted date in the form data
    data.formattedDate = formattedDate;

    data.bookingTime = this.selectedValue;
    //Get customers email
    const token = localStorage.getItem('token') as string;
    const decoded = jwt_decode(token) as any;
    const email = decoded.email;
    //data.email = email
    //get customer id 
    //data.customerID = this.getCustomerID();



    this.http.post('http://localhost:3000/v1/api/booking/', data).subscribe(response => {
      console.log(response);
      console.log("Booking Submitted");
      alert("Success! Thank you for booking with us! Your booking is scheduled for " + data.formattedDate + " at " + data.bookingTime + ".");
      console.log(data);
    }, 
    error => {
      console.error(error);
      alert("Something Went Wrong, Please try again.");
    });
  }

}