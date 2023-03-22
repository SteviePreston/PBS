import { Component, OnInit, HostListener } from '@angular/core';
import { AdminComponent } from '../admin/admin.component';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
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
  

  constructor(public authService: AuthUserService,  private router: Router) {}

  
  height = window.innerHeight;
  width = window.innerWidth;
  isMenuOpen = true;
  isAdmin = false;


  ngOnInit(){
    console.log("header is being reloaded");
    console.log('isAdmin', this.isAdmin);
    if(this.width < 768) {
      this.isMenuOpen = false;
    };
    this.authService.checkAdmin();
    //this.isAdmin = this.authService.userIsAdmin;
    
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
  
  headerLogout() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/login') {
        window.location.reload();
      }
    });
    this.headerReload();
    this.authService.logout();
  }

  headerReload() {
    console.log("header reload");
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([this.router.url]);  
  }
}
