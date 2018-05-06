import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    registroForm: FormGroup;
    userdata: any;

    erroresForm = {
        'username': '',
        'name': '',
        'surname': '',
        'email': '',
        'phone': '',
        'password': ''
    };

    mensajesValidacion = {
        'username': {
            'required': 'Usuario obligatorio',
            'minlength': 'El usuario debe tener al menos 6 caracteres'
        },
        'name': {
            // 'required': 'Nombre obligatorio',
            'minlength': 'El nombre debe tener al menos 3 caracteres'
        },
        'surname': {
            // 'required': 'Apellidos obligatorio',
            'minlength': 'Los apellidos debe tener al menos 3 caracteres'
        },
        'email': {
            'required': 'Email obligatorio',
            'email': 'Introduzca una dirección email correcta'
        },
        'password': {
            'required': 'Contraseña obligatoria',
            'pattern': 'La contraseña debe tener al menos una letra y un número ',
            'minlength': 'además de al menos 6 caracteres'
        },
        'phone': {
            'pattern': 'Teléfono no válido'
        }
    };

    constructor(private formBuilder: FormBuilder,
        private authService: AuthenticationService,
        private router: Router,
        private activatedRouter: ActivatedRoute,
        private notification: NotificationsService,
        private titleService: Title) { }

    ngOnInit() {
        this.titleService.setTitle('Registro');
        this.registroForm = this.formBuilder.group({
            'username': ['', [Validators.required, Validators.minLength(6)]],
            'name': ['', [Validators.minLength(3)]],
            'surname': ['', [Validators.minLength(3)]],
            'email': ['', [Validators.required, Validators.email]],
            // tslint:disable-next-line:max-line-length
            'password': ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'), Validators.minLength(6)]],
            'phone': ['', [Validators.pattern(/^(\+34|0034|34)?[6|7|9][0-9]{8}$/)]]
        });
        this.registroForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged();
    }

    onSubmit() {
        this.userdata = this.saveUserdata();
        this.authService.registerUser(this.userdata).subscribe(respuesta => {
            this.notification.success('Usuario registrado con éxito', 'Verifique su email', {});
            this.router.navigate(['/']);
        }, error => {
            let mensaje = '';
            if (error.error.error.details) {
                if (error.error.error.details.messages.email) {
                    mensaje = 'El email ya existe';
                } else if (error.error.error.details.messages.username) {
                    mensaje = 'El nombre de usuario ya existe';
                }
            }
            this.notification.error('Error al crear el usuario', mensaje, {});
        });
    }

    saveUserdata() {
        const saveUserdata = {
            username: this.registroForm.get('username').value,
            name: this.registroForm.get('name').value,
            surname: this.registroForm.get('surname').value,
            email: this.registroForm.get('email').value,
            phone: this.registroForm.get('phone').value,
            password: this.registroForm.get('password').value
        };
        return saveUserdata;
    }

    onValueChanged(data?: any) {
        if (!this.registroForm) { return; }
        const form = this.registroForm;
        // tslint:disable-next-line:forin
        for (const field in this.erroresForm) {
            this.erroresForm[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.mensajesValidacion[field];
                // tslint:disable-next-line:forin
                for (const key in control.errors) {
                    this.erroresForm[field] += messages[key] + ' ';
                }
            }
        }
    }

}
