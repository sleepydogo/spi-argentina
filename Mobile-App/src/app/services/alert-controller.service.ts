import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertControllerService {

  constructor(private loadingController: LoadingController, private alertController: AlertController) { }

  async showLoadingIndicator(msj: string) {
    const loadingIndicator = await this.loadingController.create({
      message: msj,
    });
    await loadingIndicator.present();
    return loadingIndicator;
  }

  async showMessageWithOkButton(header: string, msg: string) {
    const alert = await this.alertController.create({
      header: header,
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
    return alert;
  }
}
