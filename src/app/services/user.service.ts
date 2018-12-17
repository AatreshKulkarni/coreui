import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

// domain = 'https://wildseve-node.appspot.com/';
domain = 'https://wildseveproject.appspot.com/';
//domain = "https://odk-server-project.appspot.com/";
authToken;
user;
options;

  constructor(private http: HttpClient) { }

login(user) {
  return this.http.post(this.domain + 'authUser', user)
  .pipe(map(res => {

    localStorage.setItem('user', JSON.stringify(res));
    localStorage;
    return res;
  }));
}

// Function to logout
logout() {
  // this.authToken = null; // Set token to null
  // this.user = null; // Set user to null
  localStorage.clear(); // Clear local storage
}

}


