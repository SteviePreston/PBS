import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private API_PATH = 'http://localhost:3000/v1/api'; // Replace with your API path

  constructor(private http: HttpClient) {}

  getBookingsForCalendar(): Observable<any[]> {
    console.log("getBookings being hit");
    return this.http.get<any[]>(`${this.API_PATH}/bookings`).pipe(
      tap(() => console.log("Request sent")),
      map(bookings => {
        console.log("Response received:", bookings);
        return bookings.map(booking => {

          let bookingDate = booking.bookingDate;
          let bookingTime = booking.bookingTime;;

          // Create a new Date object from the bookingDate string
          const dateObj = new Date(bookingDate);

          // Get the timezone offset in minutes
          const tzOffset = dateObj.getTimezoneOffset();

          // Concatenate the bookingDate and bookingTime strings and adjust for the timezone offset
          const combinedDateStr = `${bookingDate.slice(0, 10)}T${bookingTime}.000Z`;
          const adjustedDateObj = new Date(combinedDateStr);
          adjustedDateObj.setMinutes(adjustedDateObj.getMinutes() - tzOffset);

          // Add 4 hours (240 minutes) to the adjusted date object to get the endDate
          const endDateObj = new Date(adjustedDateObj);
          endDateObj.setMinutes(endDateObj.getMinutes() + 240);

          // Use the DatePipe class to format the adjusted and end date objects
          const datePipe = new DatePipe('en-US');
          const startDate = datePipe.transform(adjustedDateObj, 'yyyy-MM-ddTHH:mm:ss.000Z');
          const endDate = datePipe.transform(endDateObj, 'yyyy-MM-ddTHH:mm:ss.000Z');
          return {
            id: booking.bookingID,
            start: startDate,
            end: endDate,
            title: `${booking.bookingType}, 
            ${booking.firstName} ${booking.lastName},
            ${booking.email}, 
            ${booking.phoneNumber}, 
            ${booking.houseNumber}, ${booking.address}, 
            ${booking.city},
            ${booking.county}, 
            ${booking.postcode} `, 
            
            extendedProps: { ...booking }
          };
        });
      }),
      catchError(error => {
        console.error("Error in response:", error);
        return throwError(error);
      })
    );
  }
  
}