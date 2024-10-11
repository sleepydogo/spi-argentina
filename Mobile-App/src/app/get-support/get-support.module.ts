import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GetSupportPageRoutingModule } from './get-support-routing.module';

import { GetSupportPage } from './get-support.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    GetSupportPageRoutingModule
  ],
  declarations: [GetSupportPage]
})
export class GetSupportPageModule {}
