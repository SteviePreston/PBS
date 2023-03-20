import { Component, ViewChild, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router'
import { BookingService } from '../bookings.service'

import { AuthUserService } from '../auth-user.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    events: [],
    plugins: [dayGridPlugin],
  };
  
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  constructor(public authService: AuthUserService,  private router: Router, private bookingService: BookingService) {}

  ngOnInit() {
    console.log("creating calendar options");
    //this.router.navigate(['/header']);
    //this.router.navigate([this.router.url]);
    this.bookingService.getBookingsForCalendar().subscribe(
      events => {
        this.calendarOptions.events = events;
        console.log(this.calendarOptions.events);
        console.log("got events");
      },
      error => {
        console.error('Error fetching bookings', error);
      }
    );
  }

  ngAfterViewInit() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.headerComponent.ngOnInit();
      window.location.reload();
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([this.router.url]);
    });
  }

}
