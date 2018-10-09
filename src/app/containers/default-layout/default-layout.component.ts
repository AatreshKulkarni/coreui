import { Component, Input, OnInit, Inject } from '@angular/core';
import { navItems } from '../../_nav';
import { LOCAL_STORAGE, WebStorageService, SESSION_STORAGE } from 'angular-webstorage-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
   roleId = this.storage.get('roleId');

  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
  }
   ngOnInit() {
     //Normal user will not have 'Users' menu
    if(this.roleId == "2"){
      this.navItems.splice(this.navItems.length-1)
    }
  }
}
