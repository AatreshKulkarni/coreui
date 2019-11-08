import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { AddUser } from './../models/addUser';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AddUserService {

  // private uri = 'https://wildseve-node.appspot.com/';
  private uri = "https://nodeapplication.azurewebsites.net/";
// private uri = 'https://odk-server-project.appspot.com/';

  constructor(private http: HttpClient) {
  }


  createUser(firstname, lastname, username, phone, email, password, roleid)
  {
    const add_user  = {
      firstname: firstname,
      lastname: lastname,
      username: username,
      phone: phone,
      email: email,
      password: password,
      roleid: roleid
    };
      return this.http.post(this.uri + 'createuser', add_user);

  }


  updateUser(userData)
  {
    // const update_user  = {
    //   firstname: userData.firstname,
    //   lastname: userData.lastname,
    //   username: userData.username,
    //   phone: userData.phonenumber,
    //   email: userData.email,
    //   password: userData.password,
    //   roleid: userData.roleid
    // };
    console.log(userData);
    // console.log(update_user);
      return this.http.post(this.uri + 'updateuser', userData);
  }

  getUser(): Observable<any> {
    return this.http.get(this.uri + 'users');
  }

  deleteUser(id): Observable<any> {
    return this.http.get(this.uri + `deleteuser/${id}`);
  }

}
