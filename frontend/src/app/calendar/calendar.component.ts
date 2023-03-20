import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router'

import { AuthUserService } from '../auth-user.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  constructor(public authService: AuthUserService,  private router: Router) {}

  ngOnInit() {
    this.router.navigate(['/header']);
    this.router.navigate([this.router.url]);
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

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin]
  };
}
