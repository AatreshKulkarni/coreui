import { Component, Input, OnInit, Inject } from '@angular/core';
import { navItems } from '../../_nav';
import { LOCAL_STORAGE, WebStorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
   roleId = this.storage.get('roleId');

  user: any = "";
  userName: any = "";

  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, private authUser: UserService, private router: Router) {

    this.user = JSON.parse(localStorage.getItem("user"));

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }
   ngOnInit() {
     //Normal user will not have 'Users' menu
     this.userName = this.user.response[0].First_name + " " + this.user.response[0].Last_name;
    this.roleId = this.user.response[0].User_Role_Id;
     if(this.roleId == "2"){
      this.navItems  = this.navItems.slice(0, navItems.length-2);
    }
  }


  logoutUser(){
    this.authUser.logout();
  }
}
