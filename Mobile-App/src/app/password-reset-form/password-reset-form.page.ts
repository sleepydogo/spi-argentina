import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { HttpService } from '../services/http.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertControllerService } from '../services/alert-controller.service';

@Component({
  selector: 'app-password-reset-form',
  templateUrl: './password-reset-form.page.html',
  styleUrls: ['./password-reset-form.page.scss'],
})
export class PasswordResetFormPage implements OnInit {
  previousView!: string;
  token!: string;

  constructor(
    private navCtrl: NavController,
    private httpService: HttpService,
    private route: Router,
    private translate: TranslateService,
    private alertController: AlertControllerService
  ) {
    const navigation = this.route.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const state = navigation.extras.state as {
        previousView: string;
        token: string;
      };
      this.previousView = state.previousView;
      this.token = state.token;
    }
  }

  password1: string = '';
  password2: string = '';

  ngOnInit() {}

  async submit() {
    if (this.password1 == this.password2) {
      const formData = new FormData();
      formData.append('token', this.token);
      formData.append('new_password1', this.password1);
      formData.append('new_password2', this.password2);

      const response = await this.httpService.POST_NoAuth(
        'api/change-psw',
        formData
      );
      if (response.message != null) {
        const title = await this.translate.get('success').toPromise();
        const message = await this.translate
          .get('password_changed_succesfully')
          .toPromise();
        this.alertController.showMessageWithOkButton(title, message);
        this.navCtrl.navigateRoot(['./sign-in']);
      } else {
        const title = await this.translate.get('error').toPromise();
        const message = await this.translate
          .get('an_error_has_ocurred_please_try_again_later')
          .toPromise();
        this.alertController.showMessageWithOkButton(title, message);
      }
    } else {
      const title = await this.translate.get('error').toPromise();
      const message = await this.translate
        .get('passwords_have_to_match')
        .toPromise();
      this.alertController.showMessageWithOkButton(title, message);
    }
  }
}
