import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-my-modal',
  template: `
   <div class="modal-container">
  <h2>Event Details</h2>
  <div class="modal-content">
    <div class="modal-row">
      <div class="modal-field">
        <label>Booking ID:</label>
        <span>{{ data.bookingID }}</span>
      </div>
      <div class="modal-field">
        <label>Customer ID:</label>
        <span>{{ data.customerID }}</span>
      </div>
      <div class="modal-field">
        <label>Booking Date:</label>
        <span>{{ data.bookingDate }}</span>
      </div>
      <div class="modal-field">
        <label>Booking Time:</label>
        <span>{{ data.bookingTime }}</span>
      </div>
      <div class="modal-field">
        <label>Booking Type:</label>
        <span>{{ data.bookingType }}</span>
      </div>
    </div>
    <div class="modal-row">
      <div class="modal-field">
        <label>House Number:</label>
        <span>{{ data.houseNumber }}</span>
      </div>
      <div class="modal-field">
        <label>Address:</label>
        <span>{{ data.address }}</span>
      </div>
      <div class="modal-field">
        <label>City:</label>
        <span>{{ data.city }}</span>
      </div>
      <div class="modal-field">
        <label>County:</label>
        <span>{{ data.county }}</span>
      </div>
      <div class="modal-field">
        <label>Postcode:</label>
        <span>{{ data.postcode }}</span>
      </div>
    </div>
    <div class="modal-row">
      <div class="modal-field">
        <label>First Name:</label>
        <span>{{ data.firstName }}</span>
      </div>
      <div class="modal-field">
        <label>Last Name:</label>
        <span>{{ data.lastName }}</span>
      </div>
      <div class="modal-field">
        <label>Email:</label>
        <span>{{ data.email }}</span>
      </div>
      <div class="modal-field">
        <label>Phone Number:</label>
        <span>{{ data.phoneNumber }}</span>
      </div>
    </div>
  </div>
  <button mat-button (click)="closeDialog()" style="float: right; margin-bottom:20px;">Close</button>
  <iframe
    width="100%"
    height="400"
    frameborder="0"
    style="border: 0"
    [src]="sanitizedUrl"
    allowfullscreen
  ></iframe>
</div>
  `,
  styles: [
    `
      .modal-container {
        padding: 16px;
        border: 1px solid #ccc;
        max-height: 80vh; /* set the maximum height of the modal to 80% of the viewport height */
        overflow-y: auto; /* add a vertical scrollbar when the content exceeds the height of the modal */
      }
      h2 {
        margin-top: 0;
      }
      .modal-content {
        display: flex;
        flex-wrap: wrap;
      }
      .modal-field {
        flex: 1 1 50%;
        padding: 8px;
        display: flex;
        align-items: center;
      }
      .modal-field label {
        margin-right: 8px;
        font-weight: bold;
      }
    `,
  ],
})
export class MyModalComponent {
  sanitizedUrl!: SafeResourceUrl;
  constructor(
    public dialogRef: MatDialogRef<MyModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sanitizer: DomSanitizer
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
    const address = `${this.data.houseNumber} ${this.data.address}, ${this.data.city}, ${this.data.county} ${this.data.postcode}`;
    const mapUrl = `https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(
      address
    )}&key=AIzaSyAqtSqjvVuBp9ll1B4Jwa412K4sv27wsGk`;
    this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
  }
}
