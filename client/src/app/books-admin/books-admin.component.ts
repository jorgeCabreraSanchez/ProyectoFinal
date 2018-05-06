import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Title } from '@angular/platform-browser';

import { AuthenticationService, ContactsService, BooksService } from '../services/index';

@Component({
  selector: 'app-books-admin',
  templateUrl: './books-admin.component.html',
  styleUrls: ['./books-admin.component.css']
})
export class BooksAdminComponent implements OnInit {

  books: any = [];
  bookId: string;

  constructor(private booksService: BooksService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private titleService: Title,
    private authenticationService: AuthenticationService,
    private contactsService: ContactsService) {
    this.booksService.getAllBooks()
      .subscribe(books => {
        this.books = books;
      },
        error => {
          console.log(error);
          // this.router.navigate(['']);
        });
  }

  ngOnInit() {
    this.titleService.setTitle('Libros');
  }

  delBook(idBook$) {
    this.booksService.deleteBook(idBook$)
      .subscribe(delbook => {
        this.books = [];
        this.booksService.getAllBooks()
          .subscribe(books => {
            // tslint:disable-next-line:no-shadowed-variable forin
            for (const idBook$ in books) {
              const p = books[idBook$];
              p.id$ = idBook$;
              this.books.push(books[idBook$]);
            }
          });
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
