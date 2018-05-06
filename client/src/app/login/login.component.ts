import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';
import { AuthenticationService, ContactsService } from '../services/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  returnUrl: string;

  constructor(private router: Router,
    private authenticationService: AuthenticationService,
    private contactsService: ContactsService,
    private Notification: NotificationsService,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Iniciar sesión');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      if (this.contactsService.isAuthenticated()) {
        this.router.navigate(['contactos']);
      } else {
        this.authenticationService.logout();
        console.log('Borra el currentUser');
      }
    }
  }

  login() {
    this.loading = true;
    this.authenticationService.login(this.model.email, this.model.password)
      .subscribe(
        data => {
          this.authenticationService.asignRole(data)
            .subscribe(resultado => {
              this.router.navigate(['contactos']);
            });
        },
        error => {
          console.log(error);
          let message;
          if (error.error.error && error.error.error.message) {
            message = error.error.error.message;
          } else {
            message = 'Ha ocurrido un error con la aplicación';
          }
          this.Notification.error(message, '', {});
          this.loading = false;
        });
  }

}
