import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationService, ContactsService } from '../services/index';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  books: any = [];
  idContact: string;
  bookId: string;

  constructor(private contactsService: ContactsService,
    private titleService: Title,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private authenticationService: AuthenticationService) {
    this.activatedRouter.params
      .subscribe(parametros => {
        this.idContact = parametros['idContact'];
        this.contactsService.getBooks(this.idContact)
          .subscribe(books => {
            this.books = books;
          },
            error => {
              console.log(error);
              this.router.navigate(['contactos']);
            });
      });
  }

  ngOnInit() {
    this.titleService.setTitle('Libros');
  }

  delBook(idContact$, idBook$) {
    this.contactsService.delBook(idContact$, idBook$)
      .subscribe(delbook => {
        this.books = [];
        this.contactsService.getBooks(this.idContact)
          .subscribe(books => {
            // tslint:disable-next-line:forin no-shadowed-variable
            for (const idContact$ in books) {
              const p = books[idContact$];
              p.idContact$ = idContact$;
              this.books.push(books[idContact$]);
            }
          });
      });
  }

  delBooks(idContact$) {
    this.contactsService.delBooks(idContact$)
      .subscribe(delbook => {
        this.books = [];
      });
  }

  idEliminar(id) {
    this.bookId = id;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['']);
  }

}
