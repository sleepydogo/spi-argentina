import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
import { Device } from '@capacitor/device';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class VersionCheckService {
  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private translate: TranslateService
  ) {}

  async checkAppVersion(): Promise<void> {
    try {
      const response: any = await this.http
        .get(`${environment.apiUrl}api/get-app-current-version`)
        .toPromise();
      const serverVersion = response.version;
      const appVersion = environment.appVersion;

      if (this.compareVersions(serverVersion, appVersion)) {
        this.showUpdateAlert();
      }
    } catch (error) {
      console.error('Error checking app version:', error);
    }
  }

  private compareVersions(serverVersion: string, appVersion: string): boolean {
    const serverVersionParts = serverVersion.split('.').map(Number);
    const appVersionParts = appVersion.split('.').map(Number);

    for (let i = 0; i < serverVersionParts.length; i++) {
      if (serverVersionParts[i] > appVersionParts[i]) {
        return true;
      }
    }
    return false;
  }

  private async showUpdateAlert() {
    const platform = (await Device.getInfo()).platform;

    let appStoreLink = '';
    if (platform === 'ios') {
      appStoreLink = 'https://apps.apple.com/app/ubik-conductor/id6563142480';
    } else if (platform === 'android') {
      appStoreLink = 'https://play.google.com/store/apps/details?id=com.ubik.conductor';
    } else {
      appStoreLink = 'https://play.google.com/store/apps/details?id=com.ubik.conductor';
    }

    const alert = await this.alertController.create({
      header: this.translate.instant('update_available'),
      message:
      this.translate.instant('new_version_available'),
      buttons: [
        {
          text: this.translate.instant('update'),
          handler: () => {
            window.location.href = appStoreLink; // Enlace a la tienda de aplicaciones
          },
        },
      ],
      backdropDismiss: false,
    });
    await alert.present();
  }
}
