import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GetSupportPage } from './get-support.page';

const routes: Routes = [
  {
    path: '',
    component: GetSupportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GetSupportPageRoutingModule {}
