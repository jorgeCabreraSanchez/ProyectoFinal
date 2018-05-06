import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import * as $ from 'jquery';
import { Title } from '@angular/platform-browser';
import { ContactsService } from '../services/contacts.service';

@Component({
  selector: 'app-modified-contact',
  templateUrl: './modified-contact.component.html',
  styleUrls: ['./modified-contact.component.css']
})
export class ModifiedContactComponent implements OnInit {

  contactoForm: FormGroup;
  contact: any = { username: '', name: '', surname: '', phone: '', email: '', image: '' };
  idContact: string;
  username: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  image: File;
  validate = false;
  // emailValid = true;

  constructor(private pf: FormBuilder, private contactsService: ContactsService, private router: Router,
    private activatedRouter: ActivatedRoute, private notification: NotificationsService, private titleService: Title) {
    this.activatedRouter.params
      .subscribe(parametros => {
        this.idContact = parametros['idContact'];
        this.contactsService.getContact(this.idContact).subscribe(contact => {
          // console.log(contact);
          this.contact = contact;
          this.username = this.contact.username;
          this.name = this.contact.name;
          this.surname = this.contact.surname;
          this.phone = this.contact.phone;
          this.email = this.contact.email;
          // this.imagen = $("#imagen").val().replace(/^.*\\/, "")
          this.onChanges();
        });
      });
  }

  ngOnInit() {
    this.titleService.setTitle('Modificar contacto');
    this.contactoForm = this.pf.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.minLength(3)]],
      surname: ['', [Validators.minLength(3)]],
      phone: ['', [Validators.pattern(/^(\+34|0034|34)?[6|7|9][0-9]{8}$/)]],
      email: ['', [Validators.required, Validators.email]],
      image: ['']
    });
  }

  onSubmit() {
    this.contact = this.saveContact();
    this.contactsService.patchContact(this.contact, this.idContact).subscribe((editcon: any) => {
      if ($('#image')[0].files[0]) {
        this.contactsService.postImage($('#image')[0].files[0], editcon.id).subscribe(data => {
          this.router.navigate(['/contactos']);
        },
          error => {
            console.log(error);
            this.router.navigate(['/contactos']);
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

      this.notification.success('Usuario Modificado con éxito', '', {});

    },
      error => {
        this.notification.error('Error al modificar el usuario', '', {
          showProgressBar: true,
          pauseOnHover: false,
          clickToClose: false,
          maxLength: 10
        });
        // this.emailValid = false;
      });
  }

  saveContact() {
    const saveContact = {
      username: this.contactoForm.get('username').value,
      name: this.contactoForm.get('name').value,
      surname: this.contactoForm.get('surname').value,
      phone: this.contactoForm.get('phone').value,
      email: this.contactoForm.get('email').value
    };
    return saveContact;
  }

  onChanges(): void {
    this.contactoForm.valueChanges
      .subscribe(valor => {
        if (valor.username !== this.username || valor.name !== this.name
          || valor.surname !== this.surname || valor.phone !== this.phone || valor.email !== this.email) {
          this.validate = true;
          // alert(this.name + valor.name);
        } else {
          this.validate = false;
        }
      });
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
