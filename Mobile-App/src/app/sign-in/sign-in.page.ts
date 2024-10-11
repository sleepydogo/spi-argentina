import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { AuthenticationService } from '../services/auth.service';
import { Preferences } from '@capacitor/preferences';
import { Constants } from 'src/models/contants.models';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  viewType!: string;
  constructor(
    private route: Router,
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private loadingController: LoadingController, // muestra mensajes a los usuarios
    private alertController: AlertController
  ) {}

  postData = {
    username: '',
    password: '',
  };

  async ngOnInit() {
    if ((await Preferences.get({ key: Constants.RECOVERY_EMAIL })).value != null || (await Preferences.get({ key: Constants.VERIFICATION_EMAIL })).value != null) {
      this.route.navigate(['./verification']);
    }
  }

  setViewType(vt: string) {
    this.viewType = vt;
  }

  signUp() {
    this.route.navigate(['./sign-up']);
  }

  skip() {
    this.navCtrl.navigateRoot(['./tabs']);
  }

  resetPassword() {
    this.route.navigate(['./password-reset']);
  }

  validateInputs() {
    let username = this.postData.username.trim();
    let password = this.postData.password.trim();
    return (
      this.postData.username &&
      this.postData.password &&
      username.length > 0 &&
      password.length > 0
    );
  }

  async login() {
    if (!this.validateInputs()) {
      this.mostrarAlerta('Hubo un error!', 'No puede dejar campos vacios.');
    } else {
      const loadingIndicator = await this.showLoadingIndicator();
      try {
        const formData = new FormData();
        formData.append('username', this.postData.username);
        formData.append('password', this.postData.password);
        await this.authService.login(formData).then(() => {
          this.navCtrl.navigateRoot(['./tabs']);
        });
      } catch (e) {
        console.error(e);
        this.mostrarAlerta(
          'Hubo un error!',
          'Hay un error con los datos ingresados, verifiquelos e intente nuevamente!'
        );
      } finally {
        loadingIndicator.dismiss();
      }
    }
  }

  private async showLoadingIndicator() {
    const loadingIndicator = await this.loadingController.create({
      message: 'Aguarde un momento ...',
    });
    await loadingIndicator.present();
    return loadingIndicator;
  }

  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
