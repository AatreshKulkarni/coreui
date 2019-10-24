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

  fetchUser() {
    this.users = this.addUser.getUser()
    this.users.subscribe((data) => {
      console.log(data.response);
      this.dataSource = data.response.filter(obj => {return obj.User_Role_Id != 0})
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
    email: ['', Validators.required, Validators.email],
    phonenumber: ['',Validators.required],
    password: ['', Validators.required],
    roleid: ['', Validators.required]
  })
 // let matcher = new UsersComponent();
  }

  getErrorMessage() {
    return this.createForm.value.email.hasError('required') ? 'You must enter a value' :
        this.createForm.value.email.hasError('email') ? 'Not a valid email' :
            '';
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


    isFieldInvalid(field: string) {
      return (
        (!this.updateForm.get(field).valid && this.updateForm.get(field).touched) ||
        (this.updateForm.get(field).untouched)
      );
    }

    createForm() {
      this.updateForm = this.fb.group({
        username: [''],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['',  Validators.email],
      phone: ['',Validators.required],
      password: ['', Validators.required],
      roleid: ['', Validators.required]
      })
    }

    getErrorMessage() {
      return this.updateForm.value.email.hasError('required') ? 'You must enter a value' :
          this.updateForm.value.email.hasError('email') ? 'Not a valid email' :
              '';
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

  updateUser(userData){
    this.addUser.updateUser(userData).subscribe((res) => {
      this.dialogRef.close();
      console.log(res);
    });
  }

    ngOnInit() {
      this.updateForm.get('firstname').setValue(this.data.First_name);
      this.updateForm.get('lastname').setValue(this.data.Last_name);
      this.updateForm.get('username').setValue(this.data.User_name);
      this.updateForm.get('phone').setValue(this.data.Phone_number);
      this.updateForm.get('email').setValue(this.data.Email_id);
      this.updateForm.get('password').setValue(this.data.User_pwd);
      this.updateForm.get('roleid').setValue(this.data.User_Role_Id);
    }

  }


  @Component({
    templateUrl: 'dialog.component.html',
    styleUrls: ['dialog.component.scss']
  })
  export class MatConfirmDialogComponent implements OnInit{

    message: any;
    roleId:any;
    user = JSON.parse(localStorage.getItem("user"));

    constructor(
      public dialogRef: MatDialogRef<UsersComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,private addUser: AddUserService){
       console.log(this.data);
      }

      ngOnInit(){
        this.roleId =  this.user.response[0].User_Role_Id;
       if(this.roleId === '0'){
        this.message = "Do you want to delete " + this.data.User_name + "?";
       }
        else if(this.roleId !== '0' && this.data.User_Role_Id === '1'){
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
