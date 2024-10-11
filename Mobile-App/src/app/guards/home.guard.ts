import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { Constants } from 'src/models/contants.models';

@Injectable({
  providedIn: 'root'
})
export class HomeGuard implements CanActivate {
  constructor(
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | import('@angular/router').UrlTree | import('rxjs').Observable<boolean | import('@angular/router').UrlTree> | Promise<boolean | import('@angular/router').UrlTree> {
    console.log('Realizando comprobacion del tokenn ...');
    return new Promise<boolean>((resolve) => {
      Preferences
        // intentamos obtener el token de autenticacion en localstorage
        .get({ key: Constants.AUTH_TOKEN})
        .then((res) => {
          // Si lo encuentra retorna true, caso contrario false
          if (res.value != null) {
            console.log('Se encontro el token, dirigiendo a home');
            resolve(true);
          } else {
            this.router.navigate(['sign-in']);
            resolve(false);
          }
        })
        // En caso de error retornamos false
        .catch((err) => {
          resolve(false);
        });
    });
  }
}
