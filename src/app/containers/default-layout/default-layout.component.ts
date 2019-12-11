import { Component, Input, OnInit, Inject, AfterViewInit } from '@angular/core';
import { navItems } from '../../_nav';
import { LOCAL_STORAGE, WebStorageService, SESSION_STORAGE } from 'angular-webstorage-service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { ConnectorService } from '../../services/connector.service';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit {
 //  roleId = this.storage.get('roleId');

  user: any = "";
  userName: any = "";


  public navItems = navItems;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement = document.body;
  public disableBtn = false;
  constructor(@Inject(SESSION_STORAGE) private storage: WebStorageService, private authUser: UserService, private router: Router, private wildService: ConnectorService) {

    this.user = JSON.parse(localStorage.getItem("user"));

   authUser.login

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = document.body.classList.contains('sidebar-minimized');
    });

    this.changes.observe(<Element>this.element, {
      attributes: true
    });
    this.createForm();

  }

  yearForm: FormGroup;
  createForm(){
    this.yearForm = new FormGroup({
      year: new FormControl(''),
      month: new FormControl(''),
    });
  }

  sync(data){

  let id = "_Y"+data.year+"_M"+data.month+"_";
    console.log(id);
     let record = this.wildService.getSyncData(id);
   record.subscribe(res => {
     console.log(res.response);
     this.disableBtn = true;
  //  alert(res.response);
    setTimeout(()=> this.disableBtn = false,600*1000);
   });
  }



  roleId: any;
  projYearArr: any = [];

  selected: any;
  callYearWise(){
    let projYear = new Date();

    let curYear = projYear.getFullYear();
    if(projYear.getMonth() >= 6)
    projYear.setFullYear(curYear+1);
    for(let i=2018;i<projYear.getFullYear();i++){
      this.projYearArr.push({id: i - 2014 , year: i + '-' + (i+1)});
  }
  console.log(this.projYearArr);

      // this.selected = this.projYearArr[this.projYearArr.length-1].year;
      // console.log(this.selected);
      }

      months: any = [{id: "1", month: "July"}, {id: "2", month: "August"}, {id: "3", month: "September"},
      {id: "4", month: "October"},{id: "5", month: "November"},{id: "6", month: "December"},{id: "7", month: "January"},
      {id: "8", month: "February"},{id: "9", month: "March"},{id: "10", month: "April"},{id: "11", month: "May"},{id: "12", month: "June"}]



   ngOnInit() {
     //Normal user will not have 'Users' menu
     let months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
     this.callYearWise();
     let monthId = this.months.filter(data => {
       return data.month === months[new Date().getMonth()];
     });
    // console.log(monthId);
     this.yearForm.get('year').setValue(this.projYearArr[this.projYearArr.length-1].id);
     this.yearForm.get('month').setValue(monthId[0].id);
     console.log(this.yearForm);
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
