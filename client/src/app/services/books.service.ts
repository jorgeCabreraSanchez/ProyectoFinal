import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class BooksService {

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line:max-line-length
  // bookURL = "http://localhost:3000/api/contacts/" + JSON.parse(localStorage.getItem('currentUser')).userId + "/books?access_token=" + JSON.parse(localStorage.getItem('currentUser')).id;

  getAllBooks() {
    const url = 'http://localhost:3000/api/books';
    return this.http.get(url);
  }

  getBook(id: string) {
    const url = 'http://localhost:3000/api/books/' + id;
    return this.http.get(url);
  }

  createBook(book: any) {
    const bookURL = 'http://localhost:3000/api/books';
    const newbook = JSON.stringify(book);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    });
    return this.http.post(bookURL, newbook, { headers });
  }

  deleteBook(idBook: any) {
    const bookURL = 'http://localhost:3000/api/books/' + idBook;
    return this.http.delete(bookURL);
  }

  editBook(idBook: string, book: any) {
    const bookURL = 'http://localhost:3000/api/books/' + idBook;
    const editbook = JSON.stringify(book);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token'
    });
    return this.http.patch(bookURL, editbook, { headers });
  }

}
