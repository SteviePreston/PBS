import { Component } from '@angular/core';
import * as sgMail from '@sendgrid/mail';
@Component({
  selector: 'app-email-service',
  templateUrl: './email-service.component.html',
  styleUrls: ['./email-service.component.css']
})

export class EmailServiceComponent {
  private readonly bookingConfirmationTemplate = "d-0c68d980e8c4475a926f0dc21fc065c6";
  private readonly newBookingInfoTemplate = "d-b718c07708524e0e876c413cf043e56f";
  private readonly appointmentReminderTemplate = "d-54af7506d66a47399a35912e8dfb41a7";
  private readonly accountRegistrationTemplate = "d-985619ba6b0a4a7f8a0c53a865ace6e7";
  private readonly sender = "prestigeboilerservice@outlook.com";
  private readonly admin_email = this.sender;
  private readonly APIkey = "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";

  constructor() { 
    sgMail.setApiKey(this.APIkey);
  }

  sendEmail(recipient: string, template: string, templateData: object): void {
    const msg = {
      templateId: template,
      to: recipient,
      from: this.sender,
      dynamic_template_data: templateData,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
  }
  
  sendEmailAt(recipient: string, template: string, templateData: object, date: number): void {
    const msg = {
      templateId: template,
      to: recipient,
      from: this.sender,
      send_at: date,
      dynamic_template_data: templateData,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  sendAccountRegistration(recipient: string, name: string): void {
    const templateData = {
      "Name": name,
    }
    this.sendEmail(recipient, this.accountRegistrationTemplate, templateData);
  }
  
  setAppointmentReminder(recipient: string, date: string, templateData: object): void {
    const unixTimestamp = Math.floor(new Date(date + " " + "08:00:00.000").getTime() / 1000);
    this.sendEmailAt(recipient, this.appointmentReminderTemplate, templateData, unixTimestamp);
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
