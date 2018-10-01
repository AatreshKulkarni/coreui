

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// import { UserService } from '../../services/user.service';

// @Component({
//   selector: 'app-dashboard',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent implements OnInit {
//   form: FormGroup;
//   private formSubmitAttempt: boolean;

//   constructor(
//     private fb: FormBuilder,
//     private authService: UserService
//   ) {}

//   ngOnInit() {
//     this.form = this.fb.group({
//       userName: ['', Validators.required],
//       password: ['', Validators.required]
//     });
//   }

//   isFieldInvalid(field: string) {
//     return (
//       (!this.form.get(field).valid && this.form.get(field).touched) ||
//       (this.form.get(field).untouched && this.formSubmitAttempt)
//     );
//   }

//   onSubmit() {
//     if (this.form.valid) {
//       this.authService.login(this.form.value);
//     }
//     this.formSubmitAttempt = true;
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UserService } from './../../services/user.service';
import { Router } from '@angular/router';
// import { AuthGuard } from './../../guard/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  messageClass;
  message;
  processing = false;
  form: FormGroup;
  previousUrl;

  constructor(
    private formBuilder: FormBuilder,
    private authService: UserService,
    private router: Router,
  //  private authGuard: AuthGuard
  ) {
    this.createForm(); // Create Login Form when component is constructed
  }

  // Function to create login form
  createForm() {
    this.form = this.formBuilder.group({
      username: ['', Validators.required], // Username field
      password: ['', Validators.required] // Password field
    });
  }

  // Function to disable form
  disableForm() {
    this.form.controls['username'].disable(); // Disable username field
    this.form.controls['password'].disable(); // Disable password field
  }

  // Function to enable form
  enableForm() {
    this.form.controls['username'].enable(); // Enable username field
    this.form.controls['password'].enable(); // Enable password field
  }

  // Functiont to submit form and login user
  onLoginSubmit() {
    this.processing = true; // Used to submit button while is being processed
    this.disableForm(); // Disable form while being process
    // Create user object from user's input
    const user = {
      username: this.form.get('username').value, // Username input field
      password: this.form.get('password').value // Password input field
    };


    // Function to send login data to API
    this.authService.login(user).subscribe((data: any) => {
      // Check if response was a success or error
      console.log(data);
      if ((data.status === 200) ){
        this.messageClass = 'alert alert-success'; // Set bootstrap success class
        this.message = "Login Successful"; // Set success message
        // Function to store user's token in client local storage
    //    this.authService.storeUserData(data.token, data.user);
        // After 2 seconds, redirect to dashboard page
        setTimeout(() => {
          if (this.previousUrl) {
            this.router.navigate([this.previousUrl]); // Redirect to page they were trying to view before
          } else {
            this.router.navigate(['/dashboard']); // Navigate to dashboard view
          }
        }, 200);
      } else {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = data.response; // Set error message
        this.processing = false; // Enable submit button
        this.enableForm(); // Enable form for editting
      }
    });
  }

  ngOnInit() {
    // if (this.authGuard.redirectUrl) {
    //   this.messageClass = 'alert alert-danger'; // Set error message: need to login
    //   this.message = 'You must be logged in to view that page.'; // Set message
    //   this.previousUrl = this.authGuard.redirectUrl; // Set the previous URL user was redirected from
    //   this.authGuard.redirectUrl = undefined; // Erase previous URL
    // }
  }

}


