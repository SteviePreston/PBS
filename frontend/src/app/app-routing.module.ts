import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CalendarComponent } from './calendar/calendar.component';
import { BookingComponent } from './booking/booking.component';
import { AccountModificationComponent } from './account-modification/account-modification.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService } from './auth-guard.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from './auth-interceptor.service';

const routes: Routes = [
  { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuardService]},
  { path: 'booking', component: BookingComponent, canActivate: [AuthGuardService]},
  { path: 'accountModification', component: AccountModificationComponent, canActivate: [AuthGuardService]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent }
  //TODO: Add sign out functionality
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuardService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  exports: [RouterModule]
})
export class AppRoutingModule { }
