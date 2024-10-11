import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from '../services/auth.service';
import { countries } from 'src/helpers/countries';
import { ValidatorsService } from '../services/validators.service';
import { Preferences } from '@capacitor/preferences';
import { Constants } from 'src/models/contants.models';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  postData = {
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    password1: '',
    password2: '',
  };

  countries = countries;
  selectedCountry = this.countries[0]; // País seleccionado por defecto

  constructor(
    private route: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthenticationService,
    private validatorService: ValidatorsService
  ) {}

  ngOnInit() {}

  private tieneCampoVacio(json: any): boolean {
    for (const clave in json) {
      if (json.hasOwnProperty(clave)) {
        const valor = json[clave];

        // Comprobar si el valor es nulo, indefinido o una cadena vacía
        if (
          valor === null ||
          valor === undefined ||
          (typeof valor === 'string' && valor.trim() === '')
        ) {
          return true; // Hay al menos un campo vacío
        }
      }
    }
    return false; // No hay campos vacíos
  }

  get fullPhoneNumber() {
    return this.selectedCountry.dialCode + this.postData.phone_number;
  }

  async continue() {
    if (this.tieneCampoVacio(this.postData)) {
      this.mostrarMensajeError('No puede dejar campos vacios.');
    } else if (!this.validatorService.validateEmail(this.postData.email)) {
      this.mostrarMensajeError('El email ingresado es inválido.');
    } else {
      const loadingIndicator = await this.showLoadingIndicator(
        'Espere a que se procese su consulta'
      );
      try {
        const formData = new FormData();
        formData.append('email', this.postData.email);
        formData.append('first_name', this.postData.first_name);
        formData.append('last_name', this.postData.last_name);
        formData.append('phone_number', this.fullPhoneNumber);
        formData.append('password1', this.postData.password1);
        formData.append('password2', this.postData.password2);

        const response = await this.authService.register(formData);

        await Preferences.set({
          key: Constants.VERIFICATION_EMAIL,
          value: this.postData.email,
        });

        const navigationExtras: NavigationExtras = {
          state: {
            verificationEmail: this.postData.email,
          },
        };

        this.route.navigate(['./verification'], navigationExtras);
      } catch (e: any) {
        if (e.message === 'El número de teléfono ya está registrado.') {
          this.mostrarMensajeError(
            'Ya existe una cuenta con ese teléfono asociado!'
          );
        } else if (e.message === 'El correo electrónico ya está registrado.') {
          this.mostrarMensajeError(
            'Ya existe una cuenta con ese email asociado!'
          );
        } else {
          this.mostrarMensajeError(
            'Hubo un error al procesar su consulta, reintente en unos minutos'
          );
        }
      } finally {
        loadingIndicator.dismiss();
      }
    }
  }

  private async mostrarMensajeError(msj: string) {
    const alert = await this.alertController.create({
      header: 'Hubo un error!',
      message: msj,
      buttons: ['OK'],
    });
    await alert.present();
  }

  private async showLoadingIndicator(msj: string) {
    const loadingIndicator = await this.loadingController.create({
      message: msj,
    });
    await loadingIndicator.present();
    return loadingIndicator;
  }

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  passwordType2: string = 'password';
  passwordIcon2: string = 'eye-off';

  togglePasswordVisibility2() {
    this.passwordType2 =
      this.passwordType2 === 'password' ? 'text' : 'password';
    this.passwordIcon2 = this.passwordIcon2 === 'eye-off' ? 'eye' : 'eye-off';
  }
}
