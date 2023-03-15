import { Component, ViewChild, OnInit } from '@angular/core';
import { Location } from '@angular/common'
import { HeaderComponent } from '../header/header.component';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router'

import { AuthUserService } from '../auth-user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(HeaderComponent) headerComponent!: HeaderComponent;

  constructor(public authService: AuthUserService) {}

  ngOnInit() {
    this.headerComponent.ngOnInit();
  }
}