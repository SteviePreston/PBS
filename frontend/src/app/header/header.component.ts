import { Component, OnInit, HostListener } from '@angular/core';
import { AdminComponent } from '../admin/admin.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthUserService } from '../auth-user.service';

@Component({
  selector: 'pbs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  host: {
    '(window:resize)': 'onResize($event)'
  }
})
export class HeaderComponent {
  

  constructor(public authService: AuthUserService) {}

  
  height = window.innerHeight;
  width = window.innerWidth;
  isMenuOpen = true;
  isAdmin = false;

  ngOnInit(){
    if(this.width < 768) {
      this.isMenuOpen = false;
    };
    this.authService.checkAdmin();
    //this.isAdmin = this.authService.userIsAdmin;
    console.log('isAdmin', this.isAdmin);
  }
 

  onResize(event: any){
    this.isMenuOpen =  event.target.innerWidth >= 768
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  menuOpen(){
    return this.isMenuOpen;
  }
}
