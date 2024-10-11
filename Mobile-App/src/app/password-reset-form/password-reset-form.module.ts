import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordResetFormPageRoutingModule } from './password-reset-form-routing.module';

import { PasswordResetFormPage } from './password-reset-form.page';
import { TranslateModule } from '@ngx-translate/core';
import { CdTimerModule } from 'angular-cd-timer';
import { CountdownModule } from 'ngx-countdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    CdTimerModule,
    CountdownModule,
    PasswordResetFormPageRoutingModule
  ],
  declarations: [PasswordResetFormPage]
})
export class PasswordResetFormPageModule {}
