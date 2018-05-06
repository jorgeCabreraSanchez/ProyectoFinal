import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AuthenticationService, ContactsService } from '../services/index';

@Component({
  selector: 'app-list-contacts',
  templateUrl: './list-contacts.component.html',
  styleUrls: ['./list-contacts.component.css']
})
export class ListContactsComponent implements OnInit {

  contacts: any = [];
  contactId: string;

  constructor(private contactsService: ContactsService,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private router: Router) {
    const role = this.contactsService.getRole();
    if (role === 'admin') {
      this.contactsService.getContacts()
        .subscribe(
          contacts => {
            this.contacts = contacts;
          },
          error => {
            console.log(error);
            this.logout();
          });

    } else if (role === 'normal') {
      this.contactsService.getContact(JSON.parse(localStorage.getItem('currentUser')).userId)
        .subscribe(
          contacts => {
            this.contacts.push(contacts);
          },
          error => {
            console.log(error);
            this.logout();
          });
    } else {
      this.logout();
      console.log('No tiene ningun role asignado');
    }
  }
  // Termina constructor

  ngOnInit() {
    this.titleService.setTitle('Contactos');
  }

  delContact(id, event: any) {
    this.contactsService.delContact(id)
      .subscribe(delcon => {
        this.contacts = [];
        this.contactsService.getContacts()
          .subscribe(contacts => {
            // tslint:disable-next-line:forin
            for (const id$ in contacts) {
              const p = contacts[id$];
              p.id$ = id$;
              this.contacts.push(contacts[id$]);
            }
          });
      });
  }

  idEliminar(id) {
    this.contactId = id;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['']);
  }

}
