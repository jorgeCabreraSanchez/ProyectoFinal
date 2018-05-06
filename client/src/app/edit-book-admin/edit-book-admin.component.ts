import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { BooksService } from '../services/books.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-edit-book-admin',
  templateUrl: './edit-book-admin.component.html',
  styleUrls: ['./edit-book-admin.component.css']
})
export class EditBookAdminComponent implements OnInit {

  bookForm: FormGroup;
  book: any = { title: '', author: '' };
  // id: string;
  idBook: string;
  title: string;
  author: string;
  validate = false;

  constructor(private pf: FormBuilder,
    private booksService: BooksService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private notification: NotificationsService,
    private titleService: Title) {
    this.activatedRouter.params
      .subscribe(parametros => {
        // this.id = parametros['id'];
        // console.log(this.id);
        this.idBook = parametros['idBook'];
        // console.log(this.idBook);
        this.booksService.getBook(this.idBook).subscribe(book => {
          // console.log(book);
          this.book = book;
          this.title = this.book.title;
          this.author = this.book.author;

          this.onChanges();
        });
      });
  }

  ngOnInit() {
    this.titleService.setTitle('Editar libro');
    this.bookForm = this.pf.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      author: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    this.book = this.saveBook();
    this.booksService.editBook(this.idBook, this.book).subscribe(editcon => {
      this.notification.success('Libro Modificado con éxito', '', {});
      this.router.navigate(['libros']);
    },
      error => {
        this.notification.error('Error al modificar el libro', '', {
        });
      });
  }

  saveBook() {
    const saveBook = {
      title: this.bookForm.get('title').value,
      author: this.bookForm.get('author').value,
    };
    return saveBook;
  }

  onChanges(): void {
    this.bookForm.valueChanges
      .subscribe(valor => {
        if (valor.title !== this.title || valor.author !== this.author) {
          this.validate = true;
        } else {
          this.validate = false;
        }
      });
  }

}
