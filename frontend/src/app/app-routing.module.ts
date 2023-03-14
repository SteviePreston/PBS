import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CalendarComponent } from './calendar/calendar.component';
import { BookingComponent } from './booking/booking.component';
import { AccountModificationComponent } from './account-modification/account-modification.component';

const routes: Routes = [
  { path: 'calendar', component: CalendarComponent},
  { path: 'booking', component: BookingComponent},
  { path: 'accountModification', component: AccountModificationComponent},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  //TODO: Add sign out functionality
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
