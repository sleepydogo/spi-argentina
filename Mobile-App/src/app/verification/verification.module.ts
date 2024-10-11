import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerificationPageRoutingModule } from './verification-routing.module';

import { VerificationPage } from './verification.page';
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
    VerificationPageRoutingModule
  ],
  declarations: [VerificationPage]
})
export class VerificationPageModule {}
