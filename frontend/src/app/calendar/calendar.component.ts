import { Component, ViewChild, ElementRef, OnInit, TemplateRef } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { BookingService } from '../bookings.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthUserService } from '../auth-user.service';
import { MyModalComponent } from '../my-modal/my-modal.component';

import * as FullCalendar from '@fullcalendar/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    events: [],
    plugins: [dayGridPlugin],
    timeZone: 'UTC',
    eventClick: (info) => {
      const { extendedProps } = info.event;
      const bookingID = extendedProps['bookingID'];
      const customerID = extendedProps['customerID'];
      const bookingDate = extendedProps['bookingDate'];
      const bookingTime = extendedProps['bookingTime'];
      const bookingType = extendedProps['bookingType'];
      const houseNumber = extendedProps['houseNumber'];
      const address = extendedProps['address'];
      const city = extendedProps['city'];
      const county = extendedProps['county'];
      const postcode = extendedProps['postcode'];
      const firstName = extendedProps['firstName'];
      const lastName = extendedProps['lastName'];
      const email = extendedProps['email'];
      const phoneNumber = extendedProps['phoneNumber'];
    
      const dialogRef = this.dialog.open(MyModalComponent, {
        width: '90%',
        data: {
          bookingID,
          customerID,
          bookingDate,
          bookingTime,
          bookingType,
          houseNumber,
          address,
          city,
          county,
          postcode,
          firstName,
          lastName,
          email,
          phoneNumber,
        },
      });
    },
  };

  @ViewChild('calendar') calendarComponent!: ElementRef;

  @ViewChild('dialogContent') dialogContent!: TemplateRef<any>;

  constructor(
    public authService: AuthUserService,
    private router: Router,
    private bookingService: BookingService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    console.log('creating calendar options');
    this.bookingService.getBookingsForCalendar().subscribe(
      (events) => {
        this.calendarOptions.events = events;
        console.log(this.calendarOptions.events);
        console.log('got events');
        this.createCalendar();
      },
      (error) => {
        console.error('Error fetching bookings', error);
      }
    );
  }

  createCalendar() {
    if (this.calendarComponent) {
      console.log('calendar components:');
      console.log(this.calendarOptions);
      const calendar = new FullCalendar.Calendar(
        this.calendarComponent.nativeElement,
        this.calendarOptions
      );
      calendar.render();
    }
  }
}

