import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService, ContactsService } from './index';

@Injectable()
export class BookGuard implements CanActivate {

  // tslint:disable-next-line:no-shadowed-variable
  constructor(private authenticationService: AuthenticationService, private contactsService: ContactsService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authenticationService.isAuthenticated().then(
      authenticated => {
        if (authenticated) {
          if (this.contactsService.getRole() === 'admin') {
            return true;
          } else {
            this.router.navigate(['contactos']);
            return false;
          }
        } else {
          this.authenticationService.logout();
          this.router.navigate(['']);
          return false;
        }
      },
      error => {
        return false;
      });
  }
}
