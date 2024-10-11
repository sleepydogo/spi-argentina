import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SignInGuard } from './guards/login.guard';
import { HomeGuard } from './guards/home.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'sign-in',
    canActivate: [SignInGuard],
    loadChildren: () =>
      import('./sign-in/sign-in.module').then((m) => m.SignInPageModule),
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./sign-up/sign-up.module').then((m) => m.SignUpPageModule),
  },
  {
    path: 'verification',
    loadChildren: () =>
      import('./verification/verification.module').then(
        (m) => m.VerificationPageModule
      ),
  },
  {
    path: 'password-reset',
    loadChildren: () =>
      import('./password-reset/password-reset.module').then(
        (m) => m.PasswordResetPageModule
      ),
  },
  {
    path: 'password-reset-form',
    loadChildren: () =>
      import('./password-reset-form/password-reset-form.module').then(
        (m) => m.PasswordResetFormPageModule
      ),
  },

  {
    path: 'terms-conditions',
    loadChildren: () =>
      import('./terms-conditions/terms-conditions.module').then(
        (m) => m.TermsConditionsPageModule
      ),
  },
  {
    path: '',
    canActivate: [HomeGuard],
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomePageModule),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./account/account.module').then((m) => m.AccountPageModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfilePageModule),
      },
      {
        path: 'select-language',
        loadChildren: () =>
          import('./select-language/select-language.module').then(
            (m) => m.SelectLanguagePageModule
          ),
      },
      {
        path: 'get-support',
        loadChildren: () =>
          import('./get-support/get-support.module').then(
            (m) => m.GetSupportPageModule
          ),
      },
      {
        path: 'faqs',
        loadChildren: () =>
          import('./faqs/faqs.module').then((m) => m.FaqsPageModule),
      },
      {
        path: 'ratings',
        loadChildren: () =>
          import('./ratings/ratings.module').then((m) => m.RatingsPageModule),
      },
      {
        path: 'ride-info',
        loadChildren: () =>
          import('./ride-info/ride-info.module').then(
            (m) => m.RideInfoPageModule
          ),
      },
    ],
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
