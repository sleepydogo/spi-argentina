// authentication.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../environments/environment';
import { Constants } from 'src/models/contants.models';


@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  /**
   * Funcion para realizar el inicio de sesion
   * @param formData 
   *  {
   *    username: string,
   *    password: string
   *  }
   */
  async login(formData: any): Promise<void> {
    const response = await this.http
      .post<any>(`${environment.apiUrl}api/log-in`, formData)
      .toPromise();
    if (response && response.access) {
      // Almacena el token en Preferences
      await Preferences.set({ key: Constants.AUTH_TOKEN, value: response.access });
      await Preferences.set({ key: Constants.REFRESH_TOKEN, value: response.refresh });
    }
  }

  /**
   * Funcion para realizar el registro del usuario
   * @param formData {
   *  nombre_completo: string,
   *  numero de telefono: string,
   *  email: string,
   *  password1: string,
   *  password2: string
   * }
   */
  async register(formData: any) {
    try {
      const response = await this.http
        .post<any>(`${environment.apiUrl}api/sign-up`, formData)
        .toPromise();
      // si se devuelve un
      if (response && response.access) {
        await Preferences.set({ key: Constants.AUTH_TOKEN, value: response.access });
        await Preferences.set({ key: Constants.REFRESH_TOKEN, value: response.refresh });
      }
    } catch (error: any) {
      throw error;
    }
  };

  logout() {
    return Preferences.clear();
  }

  isAuthenticated() {
    // Verifica si hay un token almacenado
    return Preferences.get({ key: Constants.AUTH_TOKEN }).then(
      (result) => !!result.value
    );
  }

  async refreshToken() {

    try {
      const authToken = await Preferences.get({ key: Constants.AUTH_TOKEN });
      const refresh = await Preferences.get({ key: Constants.REFRESH_TOKEN });

      if (!authToken) {
        throw new Error('No se encontró el token de autorización');
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken.value}`,
      });

      const response = await this.http
        .post<any>(`${environment.apiUrl}api/token/refresh`,
          {
            refresh: refresh.value
          },
          { headers }
        )
        .toPromise();
      if (response && response.access) {
        // Almacena el token en Preferences
        await Preferences.set({ key: Constants.AUTH_TOKEN, value: response.access });
        console.log('Se actualizo el token de autentificacion con exito');
        return true;
      }
      console.log('Fallo el refresco del token, el usuario no esta autentificado');
      await Preferences.clear();
      return false;
    }
    catch {
      console.log('Fallo el refresco del token, el usuario no esta autentificado');
      await Preferences.clear();
      return false;
    }
  }

}

