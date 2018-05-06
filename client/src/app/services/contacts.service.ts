import { Injectable } from '@angular/core';
import { HttpEvent, HttpHeaders, HttpInterceptor, HttpHandler, HttpRequest, HttpClient, HttpParams } from '@angular/common/http';
// import 'rxjs/Rx';
import 'rxjs/add/operator/map';


@Injectable()
export class ContactsService {

  conURL = 'http://localhost:3000/api/contacts';

  constructor(private http: HttpClient) { }

  getRole() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      return currentUser.role;
    } else {
      return 'undefined';
    }
  }

  isAuthenticated() {
    return localStorage.getItem('currentUser') ? true : false;
  }

  getContacts() {
    return this.http.get(this.conURL);
  }

  getContact(id: string) {
    const url = `${this.conURL}/${id}`;
    return this.http.get(url);
  }

  patchContact(contact: any, id: string) {
    const editcon = JSON.stringify(contact);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    const url = `${this.conURL}/${id}`;
    return this.http.patch(url, editcon, { headers });
  }

  postContact(contact: any) {
    const newcon = JSON.stringify(contact);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.conURL, newcon, { headers });
  }

  delContact(id: string) {
    const url = `${this.conURL}/${id}`;
    return this.http.delete(url);
  }

  // getBase64(file) {
  //   const reader = new FileReader();
  //   return new Promise((resolve, reject) => {
  //     reader.readAsDataURL(file);
  //     reader.onload = function () {
  //       resolve(reader.result);
  //     };

  //     reader.onerror = function (error) {
  //       reject(error);
  //     };
  //   })
  // }

  postImage(file: File, userId: string) {
    const fd = new FormData();
    fd.append('file', file);

    const headers = new HttpHeaders();

    return this.http.post(`http://localhost:3000/api/contacts/${userId}/upload-image`, fd, { headers });
  }

  getBooks(idUser: string) {
    const url = 'http://localhost:3000/api/contacts/' + idUser + '/books';
    return this.http.get(url);
  }

  createAndAssignBook(idUser: string, book: any) {
    const bookURL = 'http://localhost:3000/api/contacts/' + idUser + '/books';
    const newbook = JSON.stringify(book);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(bookURL, newbook, { headers });
  }

  assignBook(idUser: string, idBook: string) {
    const url = 'http://localhost:3000/api/contacts/' + idUser + '/books/rel/' + idBook;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put(url, { headers });
  }

  delBooks(idUser: string) {
    const url = 'http://localhost:3000/api/contacts/' + idUser + '/books';
    return this.http.delete(url);
  }

  delBook(idUser: string, idBook: string) {
    const url = 'http://localhost:3000/api/contacts/' + idUser + '/books/rel/' + idBook;
    return this.http.delete(url);
  }

  getBook(idUser: string, idBook: string) {
    const url = 'http://localhost:3000/api/contacts/' + idUser + '/books/' + idBook;
    return this.http.get(url);
  }

  editBook(idUser: string, idBook: string, book: any) {
    const url = 'http://localhost:3000/api/contacts/' + idUser + '/books/' + idBook;
    const editbook = JSON.stringify(book);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.put(url, editbook, { headers });
  }

  /*getBooks(contactId){
    let token = JSON.parse(localStorage.getItem('currentUser')).id;
    let params = new HttpParams().set('access_token', token);

    return this.http.get(`http://localhost:3000/api/contacts/${contactId}/books`, { params: params });
  }

  postAndAsignBook(book, contactId){
    const newbook = JSON.stringify(book);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    headers.append('Authorization', 'my-auth-token');

    return this.http.post(`http://localhost:3000/api/contacts/${contactId}/books`, newbook, { headers });
  }

  asignBook(bookId, contactId){
    let token = JSON.parse(localStorage.getItem('currentUser')).id;
    let params = new HttpParams().set('access_token', token);

    return this.http.post(`http://localhost:3000/api/contacts/${contactId}/books/rel/${bookId}`, { params: params });
  }

  delBook(bookId, contactId){
    let token = JSON.parse(localStorage.getItem('currentUser')).id;
    let params = new HttpParams().set('access_token', token);

    return this.http.delete(`http://localhost:3000/api/contacts/${contactId}/books/rel/${bookId}`, { params: params });
  }*/

  // dataURItoBlob(dataURI) {
  //   // convert base64/URLEncoded data component to raw binary data held in a string
  //   var byteString;
  //   if (dataURI.split(',')[0].indexOf('base64') >= 0)
  //     byteString = atob(dataURI.split(',')[1]);
  //   else
  //     byteString = unescape(dataURI.split(',')[1]);
  //   // separate out the mime component
  //   var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  //   // write the bytes of the string to a typed array
  //   var ia = new Uint8Array(byteString.length);
  //   for (var i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }
  //   return new Blob([ia], { type: mimeString });
  // }

}
