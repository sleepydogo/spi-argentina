import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { HttpService } from '../services/http.service';
import { Preferences } from '@capacitor/preferences';
import { Constants } from 'src/models/contants.models';
import { AlertControllerService } from '../services/alert-controller.service';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorsService } from '../services/validators.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {
  private verificationEmail: string = '';
  private mode: string = '';

  code: string = '';

  constructor(
    private navCtrl: NavController,
    private route: Router,
    private translate: TranslateService,
    private alertController: AlertControllerService,
    private validator: ValidatorsService,
    private httpService: HttpService
  ) {}
  async ngOnInit() {
    if (
      (await Preferences.get({ key: Constants.VERIFICATION_EMAIL })).value !=
      null
    ) {
      this.mode = 'VERIFICATION';
      await Preferences.get({ key: Constants.VERIFICATION_EMAIL }).then(
        (email: any) => {
          this.verificationEmail = email.value;
        }
      );
    }
    if (
      (await Preferences.get({ key: Constants.RECOVERY_EMAIL })).value != null
    ) {
      this.mode = 'RECOVERY';
      await Preferences.get({ key: Constants.RECOVERY_EMAIL }).then(
        (email: any) => {
          this.verificationEmail = email.value;
        }
      );
    }
  }

  async ionViewWillLeave() {
    if (this.mode == 'VERIFICATION') {
      await Preferences.remove({ key: Constants.VERIFICATION_EMAIL });
    }
    if (this.mode == 'RECOVERY') {
      await Preferences.remove({ key: Constants.RECOVERY_EMAIL });
    }
  }

  async ngOnDestroy() {
    if (this.mode == 'VERIFICATION') {
      await Preferences.remove({ key: Constants.VERIFICATION_EMAIL });
    }
    if (this.mode == 'RECOVERY') {
      await Preferences.remove({ key: Constants.RECOVERY_EMAIL });
    }
  }

  async sendOtp() {
    // Create and get verification code
    const formData = new FormData();
    formData.append('email', this.verificationEmail);
    this.httpService.POST_NoAuth('api/get-verif-code', formData);
    const title = await this.translate.get('success').toPromise();
    const message = await this.translate
      .get('verification_code_resent')
      .toPromise();
    this.alertController.showMessageWithOkButton(title, message);
  }

  async submit() {
    // Check if the code is 6 digits
    if (this.code.length != 6) {
      const title = await this.translate.get('error').toPromise();
      const message = await this.translate.get('code_invalid').toPromise();
      this.alertController.showMessageWithOkButton(title, message);
      return;
    }
    // We create the formdata
    const formData = new FormData();
    formData.append('email', this.verificationEmail);
    formData.append('verification_code', this.code);
    if (this.mode == 'RECOVERY') {
      await this.httpService
        .POST_NoAuth('api/get-psw-rst-token', formData)
        .then(async (response) => {
          console.log(response);
          if (response.token != null) {
            await Preferences.remove({
              key: Constants.VERIFICATION_EMAIL,
            }).then(() => {
              const navigationExtras: NavigationExtras = {
                state: {
                  previousView: 'verification-not-authenticated',
                  token: response.token,
                },
              };
              this.route.navigate(['./password-reset-form'], navigationExtras);
            });
          } else {
            const title = await this.translate.get('error').toPromise();
            const message = await this.translate
              .get('code_invalid')
              .toPromise();
            this.alertController.showMessageWithOkButton(title, message);
            return;
          }
        });
    }
    if (this.mode == 'VERIFICATION') {
      const response = await this.httpService.POST_NoAuth(
        'api/verify-account',
        formData
      );
      console.log(response);
      if (response.data != null) {
        const title = await this.translate.get('success').toPromise();
        const message = await this.translate
          .get('account_verified_successfully')
          .toPromise();
        this.alertController.showMessageWithOkButton(title, message);
        await Preferences.remove({ key: Constants.VERIFICATION_EMAIL }).then(
          () => {
            this.navCtrl.navigateRoot(['/']);
          }
        );
      } else {
        const title = await this.translate.get('error').toPromise();
        const message = await this.translate
          .get('check_connection_and_retry')
          .toPromise();
        this.alertController.showMessageWithOkButton(title, message);
      }
    }
  }
}
