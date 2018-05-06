import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../services/contacts.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import * as $ from 'jquery';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-create-contact',
  templateUrl: './create-contact.component.html',
  styleUrls: ['./create-contact.component.css']
})
export class CreateContactComponent implements OnInit {

  contactoForm: FormGroup;
  contacto: any;

  constructor(private pf: FormBuilder,
    private contactsService: ContactsService,
    private router: Router,
    private notification: NotificationsService,
    private titleService: Title) {
  }

  ngOnInit() {
    this.titleService.setTitle('Crear contacto');
    this.contactoForm = this.pf.group({
      username: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.minLength(3)]],
      surname: ['', [Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'), Validators.minLength(6)]],
      phone: ['', [Validators.pattern(/^(\+34|0034|34)?[6|7|9][0-9]{8}$/)]],
      image: ['']
    });
  }

  onSubmit() {
    this.contacto = this.saveContact();

    this.contactsService.postContact(this.contacto).subscribe((newcon: any) => {
      if ($('#image')[0].files[0]) {
        console.log(newcon);
        this.contactsService.postImage($('#image')[0].files[0], newcon.id).subscribe(
          data => {
            this.router.navigate(['contactos']);
          },
          error => {
            console.log(error);
            this.notification.error('Error al subir la imagen', '', {
              showProgressBar: true,
              pauseOnHover: false,
              clickToClose: false,
              maxLength: 10
            });
          });
      } else {
        this.router.navigate(['contactos']);
      }

      this.notification.success('Usuario Creado con éxito', '', {
        showProgressBar: true,
        pauseOnHover: false,
        clickToClose: false,
        maxLength: 10
      });
    },
      error => {
        console.log(error);
        this.notification.error('Error al crear el usuario', '', {
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: false,
          maxLength: 10
        });
      });
  }

  saveContact() {
    const saveContact = {
      username: this.contactoForm.get('username').value,
      name: this.contactoForm.get('name').value,
      surname: this.contactoForm.get('name').value,
      phone: this.contactoForm.get('phone').value,
      password: this.contactoForm.get('password').value,
      email: this.contactoForm.get('email').value,
      // emailVerified: true
    };
    return saveContact;
  }

  fileChangeEvent(fileInput: any) {
    // Volvería a ser falso si se cambia otro campo al mismo valor que el original, por tanto lo activaremos el botón con JQuery
    // this.validate = true;
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e: any) {
        $('#imagen').attr('src', e.target.result);
        $('#submit').prop('disabled', false);
      };
      reader.readAsDataURL(fileInput.target.files[0]);
    }

  }

}
