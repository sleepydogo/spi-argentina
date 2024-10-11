import { Component, OnInit } from '@angular/core';
import { ValidatorsService } from '../services/validators.service';
import { AlertControllerService } from '../services/alert-controller.service';
import { HttpService } from '../services/http.service';
import { Preferences } from '@capacitor/preferences';
import { NavController } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/models/contants.models';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.page.html',
  styleUrls: ['./password-reset.page.scss'],
})
export class PasswordResetPage implements OnInit {
  email!: string;

  constructor(
    private validators: ValidatorsService,
    private route: Router,
    private alertController: AlertControllerService,
    private translate: TranslateService,
    private httpService: HttpService
  ) {}

  ngOnInit() {
    
  }

  async submit() {
    const loadingIndicatorText = await this.translate
      .get('please_wait_a_second')
      .toPromise();
    const loadingIndicator = await this.alertController.showLoadingIndicator(
      loadingIndicatorText
    );
    if (!this.validators.validateEmail(this.email)) {
      try {
        const formData = new FormData();
        formData.append('email', this.email);
        await this.httpService.POST_NoAuth('api/get-verif-code', formData);
        loadingIndicator.dismiss();
        const title = await this.translate
          .get('operation_successful')
          .toPromise();
        const message = await this.translate
          .get('verification_code_sent_if_account_exists')
          .toPromise();

        this.alertController.showMessageWithOkButton(title, message);

        await Preferences.set({
          key: Constants.RECOVERY_EMAIL,
          value: this.email,
        });
        this.route.navigate(['./verification']);
      } catch (e) {}
    } else {
      loadingIndicator.dismiss();
      const title = await this.translate.get('error').toPromise();
      const message = await this.translate.get('invalid_email').toPromise();

      this.alertController.showMessageWithOkButton(title, message);
    }
  }
}
