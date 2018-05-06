import { Component, OnInit } from '@angular/core';
import { BooksService } from '../services/books.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create-book-admin',
  templateUrl: './create-book-admin.component.html',
  styleUrls: ['./create-book-admin.component.css']
})
export class CreateBookAdminComponent implements OnInit {

  bookForm: FormGroup;
  book: any;
  // id: any;

  constructor(private pf: FormBuilder,
    private booksService: BooksService,
    private router: Router,
    private notification: NotificationsService,
    private activatedRouter: ActivatedRoute,
    private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('Crear libro');
    this.bookForm = this.pf.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      author: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    this.book = this.saveBook();
    this.booksService.createBook(this.book).subscribe(newbook => {
      this.router.navigate(['libros']);
      this.notification.success('Libro Creado con éxito', '', {
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
        maxLength: 10
      });
    },
      error => {
        console.log(error);
        this.notification.error('Error al crear el libro', '', {
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: false,
          maxLength: 10
        });
      });
  }

  saveBook() {
    const saveBook = {
      title: this.bookForm.get('title').value,
      author: this.bookForm.get('author').value
    };
    return saveBook;
  }

}
