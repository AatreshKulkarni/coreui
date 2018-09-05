// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { BehaviorSubject } from 'rxjs';
// import { User } from '../models/user';

// @Injectable()
// export class UserService {
//   private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

//   get isLoggedIn() {
//     return this.loggedIn.asObservable();
//   }

//   constructor(
//     private router: Router
//   ) {}

//   login(user: User) {
//     if (user.userName !== '' && user.password !== '' ) {
//       this.loggedIn.next(true);
//       this.router.navigate(['/dashboard']);
//     }
//   }

//   logout() {
//     this.loggedIn.next(false);
//     this.router.navigate(['/login']);
//   }
// }

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
// import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpClient } from '@angular/common/http';



@Injectable()
export class UserService {

domain = 'https://wildseve-node.appspot.com/';
authToken;
user;
options;



  constructor(
    private http: HttpClient,
//    public jwtHelper: JwtHelperService
) {   }

 // Function to create headers, add token, to be used in HTTP requests
//  createAuthenticationHeaders() {
//   this.loadToken(); // Get token so it can be attached to headers
//   // Headers configuration options
//   this.options = new RequestOptions({
//     headers: new Headers({
//       'Content-Type': 'application/json', // Format set to JSON
//       'authorization': this.authToken // Attach token
//     })
//   });
// }

// Function to get token from client local storage
// loadToken() {
//   this.authToken = localStorage.getItem('token'); // Get token and asssign to variable to be used elsewhere
// }

//   registerUser(user) {
//     return this.http.post(this.domain + 'authentication/register', user).pipe(map(res => res.json()));
//   }

//   checkUsername(username) {
//     return this.http.get(this.domain + 'authentication/checkUsername/' + username).pipe(map(res => res.json()));
//   }

//   checkEmail(email) {
//     return this.http.get(this.domain + 'authentication/checkEmail/' + email).pipe(map(res => res.json()));
//   }


login(user) {
  return this.http.post(this.domain + 'authUser', user).pipe(map(res => res));
}

// Function to logout
logout() {
  this.authToken = null; // Set token to null
  this.user = null; // Set user to null
  localStorage.clear(); // Clear local storage
}

//  // Function to store user's data in client local storage
//  storeUserData(token, user) {
//   localStorage.setItem('token', token); // Set token in local storage
//   localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
//   this.authToken = token; // Assign token to be used elsewhere
//   this.user = user; // Set user to be used elsewhere
// }

// getProfile() {
//   this.createAuthenticationHeaders();
//   return this.http.get(this.domain + 'authentication/profile', this.options).pipe(map(res => res.json()));
// }

// getPublicProfile(username) {
//   this.createAuthenticationHeaders();
//   return this.http.get(this.domain + 'authentication/publicProfile/' + username, this.options).pipe(map(res => res.json()));
// }

// loggedIn() {
//   return this.jwtHelper.isTokenExpired(this.authToken);
// }


}


