import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { UserService } from './../services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {

  redirectUrl;

  constructor(
    private authService: UserService,
    private router: Router
  ) { }

  canActivate(router: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {
    if (localStorage.getItem('user')){
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
