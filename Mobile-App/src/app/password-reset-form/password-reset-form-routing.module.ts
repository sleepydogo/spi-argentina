import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordResetFormPage } from './password-reset-form.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordResetFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordResetFormPageRoutingModule {}
