import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators'

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
          const startDate = new Date(booking.bookingDate);
          startDate.setHours(booking.bookingTime);
          const endDate = new Date(startDate);
          endDate.setHours(endDate.getHours() + 1);
  
          return {
            id: booking.bookingID,
            start: startDate,
            end: endDate,
            title: `${booking.firstName} ${booking.lastName} (${booking.email}, ${booking.phoneNumber})`,
            extendedProps: {
              ...booking
            }
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