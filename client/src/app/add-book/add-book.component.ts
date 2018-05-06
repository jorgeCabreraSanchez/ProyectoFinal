import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BooksService } from '../services/books.service';
import { ContactsService } from '../services/contacts.service';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {

  books: any = [];
  idContact: string;
  // idBook: string;

  constructor(private booksService: BooksService,
    private contactsService: ContactsService,
    private router: Router,
    private notification: NotificationsService,
    private activatedRouter: ActivatedRoute,
    private titleService: Title) {
    this.activatedRouter.params
      .subscribe(parametros => {
        this.idContact = parametros['idContact'];
        // console.log(this.id);
        // this.idBook = parametros['idBook'];
        // console.log(this.idBook);
      });
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
    this.titleService.setTitle('Añadir libro existente');
  }

  addBook(idContact$, idBook$) {
    this.contactsService.assignBook(idContact$, idBook$)
      .subscribe(addbook => {
        this.notification.success('Libro añadido a favoritos', '');
      },
        error => {
          this.notification.error('Error al añadir el libro a favoritos', '', {
          });
        });
  }

}
