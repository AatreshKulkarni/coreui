import {Component, Inject, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatIconRegistry, MatTableDataSource} from '@angular/material';
import { AddUserService } from '../../services/addUser.service';
import { AddUser } from '../../models/addUser';
import { Observable } from 'rxjs/Observable';
import {DataSource} from '@angular/cdk/table';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import {ErrorStateMatcher} from '@angular/material/core';
import { FormGroup, FormControl,FormBuilder,FormGroupDirective, Validators } from '@angular/forms';


/**
 * @title Dialog Overview
 */
@Component({
  templateUrl: 'users.component.html',
  styleUrls: ['users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {

   users: any;

isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

  constructor(private addUser: AddUserService, public dialog: MatDialog,
    private router: Router) {
  }

  displayedColumns = ['First Name', 'Last Name', 'Username', 'Phone Number', 'Email ID', 'Actions'];
  dataSource: any;

  openCreate(): void {
    const dialogRef = this.dialog.open(UserCreateComponent, {
      width: '400px',

    });

    dialogRef.afterClosed().subscribe(() => {
      this.fetchUser();
    });


  }


  openUpdate(data): void {
    let dialogRef = this.dialog.open(UserUpdateComponent, {
      width: '400px',
      data: data
    });

    dialogRef.afterClosed().subscribe(() => {
      this.fetchUser();
    });

  }
length1: any;
  fetchUser() {
    this.users = this.addUser.getUser()
    this.users.subscribe((data) => {
      this.dataSource = data.response;
      this.length1 = this.dataSource.length;
      console.log(this.dataSource);
    })
  }

  ngOnInit() {
    this.fetchUser();
  }

  ngOnDestroy(){
    this.dialog.closeAll();
  }

  deleteUser(data) {

  let dialogRef = this.dialog.open(MatConfirmDialogComponent, {
    width: '400px',
    height: '150px',
    data: data
  });

  dialogRef.afterClosed().subscribe(() => {
    this.fetchUser();
  });

}
}


@Component({
  templateUrl: 'users-dialogue.component.html',
  styleUrls: ['users-dialogue.component.scss']
})
export class UserCreateComponent {

  createForm: FormGroup;
  private formSubmitAttempt: boolean;

  public event: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<UsersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private addUser: AddUserService,
    private fb: FormBuilder,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.createForm = this.fb.group({
      username: ['', Validators.required],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
    email: ['', Validators.email],
    phonenumber: ['',Validators.required],
    password: ['', Validators.required],
    roleid: ['', Validators.required]
  })
 // let matcher = new UsersComponent();
  }

  isFieldInvalid(field: string) {
    return (
      (!this.createForm.get(field).valid && this.createForm.get(field).touched) ||
      (this.createForm.get(field).untouched && this.formSubmitAttempt)
    );
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createUser(firstname, lastname, username, phone, email, password, roleid){

    this.addUser.createUser(firstname, lastname, username, phone, email, password, roleid).subscribe(res => {
      let data = res;
      console.log(res);
      this.dialogRef.close();
      setTimeout(() => {
        if(data.hasOwnProperty('error') ){
          alert("Username Already Exist. Please Try Other Username.")
        }
      }, 200);


      this.router.navigate['/user']
      });
  }

}

@Component({
    templateUrl: 'users-update.component.html',
    styleUrls: ['users-dialogue.component.scss']
  })
  export class UserUpdateComponent implements OnInit{

    public event: EventEmitter<any> = new EventEmitter();

    isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

    updateForm: FormGroup;

    constructor(
      public dialogRef: MatDialogRef<UsersComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private addUser: AddUserService,
      private fb: FormBuilder,
      private  router: Router
    ) {
      this.createForm();
      console.log(this.data);
    }



    createForm() {
      this.updateForm = this.fb.group({
        username: [''],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.email],
      phonenumber: ['',Validators.required],
      password: ['', Validators.required]
      })
    }

    onNoClick(): void {
      this.dialogRef.close();
    }

    keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  updateUser(firstname, lastname, username, phone, email, password){
    this.addUser.updateUser(firstname, lastname, username, phone, email, password).subscribe((res) => {
      this.dialogRef.close();
      console.log(res);
    });
  }

    ngOnInit() {
      this.updateForm.get('firstname').setValue(this.data.First_name);
      this.updateForm.get('lastname').setValue(this.data.Last_name);
      this.updateForm.get('username').setValue(this.data.User_name);
      this.updateForm.get('phonenumber').setValue(this.data.Phone_number);
      this.updateForm.get('email').setValue(this.data.Email_id);
      this.updateForm.get('password').setValue(this.data.User_pwd);
    }

  }


  @Component({
    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.scss']
  })
  export class MatConfirmDialogComponent implements OnInit{

    message: any;

    constructor(
      public dialogRef: MatDialogRef<UsersComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,private addUser: AddUserService){
       console.log(this.data);
      }

      ngOnInit(){
        if(this.data.User_Role_Id === '1'){
          this.message = "This is admin. You can't delete this user.";
        }
       else{
          this.message = "Do you wan't delete " + this.data.User_name + "?";
        }
      }

      deleteUser(){

              this.addUser.deleteUser(this.data.User_name).subscribe(() => {
               this.dialogRef.close();
            })

      }

      onNoClick(): void {
        this.dialogRef.close();
      }

  }
