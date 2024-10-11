import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RideInfoPageRoutingModule } from './ride-info-routing.module';

import { RideInfoPage } from './ride-info.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    RideInfoPageRoutingModule
  ],
  declarations: [RideInfoPage]
})
export class RideInfoPageModule { }
