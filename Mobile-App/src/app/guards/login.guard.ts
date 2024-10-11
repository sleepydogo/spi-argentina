import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';
import { AuthenticationService } from '../services/auth.service';
import { HttpService } from '../services/http.service';
import { Constants } from 'src/models/contants.models';

@Injectable({
  providedIn: 'root'
})

export class SignInGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private httpService: HttpService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | import('@angular/router').UrlTree
    | import('rxjs').Observable<boolean | import('@angular/router').UrlTree>
    | Promise<boolean | import('@angular/router').UrlTree> {

    console.log('Realizando comprobacion del tokenn ...');

    let authToken: boolean = false;

    return new Promise<boolean>((resolve) => {
      Preferences
        // intentamos obtener el token de autenticacion en localstorage
        .get({ key: Constants.AUTH_TOKEN })
        .then(async (res) => {
          if (!res || res.value === null || res.value === undefined || res === undefined) {
            // si el token no esta almacenado redireccionamos al usuario a la home
            console.log('No se encontro el token, dirigiendo a sign-in');
            resolve(true);
          } else {
            // si el token esta almacenado, intentamos refrescar el token llamando al endpoint de refresh
            // si devuelve true, joya, si no redirigimos al usuario a la home
            console.log('Se encontro el token de autenticacion');
            await this.authService.refreshToken().
              then((res: any) => {
                authToken = res;
                if (authToken) {
                  console.log('redirigiendo a home');
                  resolve(false);
                  this.router.navigate(['./tabs']);
                }
                else {
                  console.log('redirigiendo a sign-in');
                  resolve(true);
                }
              });
          }
        })
        // En caso de error retornamos true
        .catch((err) => {
          resolve(true);
        });
    });
  }
}
