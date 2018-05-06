import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AlertService, AuthenticationService, ContactsService, BookGuard, BooksService } from './services/index';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { AppComponent } from './app.component';
import { ListContactsComponent } from './list-contacts/list-contacts.component';
import { ModifiedContactComponent } from './modified-contact/modified-contact.component';
import { CreateContactComponent } from './create-contact/create-contact.component';
import { LoginComponent } from './login/login.component';
import { AlertComponent } from './directives/alert.component';
import { RegisterComponent } from './register/register.component';
import { PasswordResetComponent } from './password-reset/password-reset/password-reset.component';
import { PasswordNewComponent } from './password-reset/password-new/password-new.component';
import { PasswordChangeComponent } from './password-change/password-change.component';
import { BooksComponent } from './books/books.component';
import { AddBookComponent } from './add-book/add-book.component';
import { HeaderComponent } from './header/header.component';
import { BooksAdminComponent } from './books-admin/books-admin.component';
import { EditBookAdminComponent } from './edit-book-admin/edit-book-admin.component';
import { CreateBookAdminComponent } from './create-book-admin/create-book-admin.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'contactos', component: ListContactsComponent },
  { path: 'contactos/modificar/:idContact', component: ModifiedContactComponent },
  { path: 'contactos/nuevo', component: CreateContactComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: PasswordResetComponent },
  { path: 'new-password', component: PasswordNewComponent },
  { path: 'change-password', component: PasswordChangeComponent },
  { path: 'contactos/libros/:idContact', component: BooksComponent },
  { path: 'contactos/libros/:idContact/añadirExistente', component: AddBookComponent },
  { path: 'libros', component: BooksAdminComponent, canActivate: [BookGuard] },
  { path: 'libros/editar/:idBook', component: EditBookAdminComponent,  canActivate: [BookGuard] },
  { path: 'libros/crear', component: CreateBookAdminComponent, canActivate: [BookGuard] },
  { path: '**', redirectTo: 'contactos' }
];

@NgModule({
  declarations: [
    AppComponent,
    ListContactsComponent,
    ModifiedContactComponent,
    CreateContactComponent,
    LoginComponent,
    AlertComponent,
    RegisterComponent,
    PasswordResetComponent,
    PasswordNewComponent,
    PasswordChangeComponent,
    BooksComponent,
    AddBookComponent,
    HeaderComponent,
    BooksAdminComponent,
    EditBookAdminComponent,
    CreateBookAdminComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload'}),
    HttpClientModule,
    ReactiveFormsModule,
    SimpleNotificationsModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    AngularFontAwesomeModule
  ],
  exports: [
    BsDropdownModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  },
    BookGuard,
    AlertService,
    AuthenticationService,
    ContactsService,
    BooksService, ],
  bootstrap: [AppComponent]
})
export class AppModule { }
