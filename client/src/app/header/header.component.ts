import { Component, OnInit } from '@angular/core';
import { RouterLinkActive } from '@angular/router';

import { ContactsService } from '../services/contacts.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private contactsService: ContactsService) {

  }

  ngOnInit() { }

  role() {
    return this.contactsService.getRole();
  }

  auth() {
    return this.contactsService.isAuthenticated();
  }

}
