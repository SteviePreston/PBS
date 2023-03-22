import { Component } from '@angular/core';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-email-service',
  templateUrl: './email-service.component.html',
  styleUrls: ['./email-service.component.css']
})
export class EmailServiceComponent {

  constructor(private http: HttpClient) { }
  private readonly bookingConfirmationTemplate = "d-3bfa744c86434182826cf9fd863bb390"
  private readonly newBookingInfoTemplate = "d-4c925f4a933244dfbcc04f44c5bd4825"
  private readonly appointmentReminderTemplate = "d-add98d1de317464197279369fc9c3216"
  private readonly accountRegistrationTemplate = "d-869c131e0be54097b6a39b3cc70da668"
  private readonly admin_email = "prestigeboiler1234@gmail.com"

  sendEmail(recipient: string, template: string, template_data: object) {
    return this.http.post('/api/send-email', { recipient, template, template_data });
  }
  scheduleEmail(recipient: string, template: string, template_data: object, date: number) {
    return this.http.post('/api/schedule-email', { recipient, template, template_data, date });
  }

  sendAccountRegistration(recipient: string, name: string): void {
    const templateData = {
      "Name": name,
    }
    this.sendEmail(recipient, this.accountRegistrationTemplate, templateData);
  }
  
  setAppointmentReminder(recipient: string, date: string, templateData: object): void {
    const unixTimestamp = Math.floor(new Date(date + " " + "08:00:00.000").getTime() / 1000);
    this.scheduleEmail(recipient, this.appointmentReminderTemplate, templateData, unixTimestamp);
  }

  sendBookingConfirmation(recipient: string, date: string, time: string, address: string, houseNo: string, county: string, city: string, postCode: string): void {
    const templateData = {
      "Date": date,
      "Time": time,
      "City": city,
      "Address": address,
      "HouseNo": houseNo,
      "County": county,
      "PostCode": postCode,
    }
    this.sendEmail(recipient, this.bookingConfirmationTemplate, templateData); // Sends email to the user
    this.sendEmail(this.admin_email, this.newBookingInfoTemplate, templateData); // Send info about new booking to the admin
    this.setAppointmentReminder(recipient, date, templateData); // Sets the email reminder
}
}

