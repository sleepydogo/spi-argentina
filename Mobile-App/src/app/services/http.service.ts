import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Constants } from 'src/models/contants.models';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  async GET_WithAuth(endpoint: string): Promise<any> {
    try {
      const authToken = await Preferences.get({ key: Constants.AUTH_TOKEN });

      if (!authToken) {
        throw new Error('No se encontró el token de autorización');
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken.value}`,
      });

      const response = await this.http
        .get<any>(`${environment.apiUrl}${endpoint}`, { headers })
        .toPromise();
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error al obtener la informacion del perfil:', error);
      throw error; // Puedes manejar el error aquí o dejar que el componente lo maneje
    }
  }

  async POST_ImgWithAuth(endpoint: string, data: any) {
    try {
      const authToken = await Preferences.get({ key: Constants.AUTH_TOKEN });
      if (!authToken) {
        throw new Error('No se encontró el token de autorización');
      }
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken.value}`,
      });
      const response = await this.http
        .post(
          `${environment.apiUrl}${endpoint}`,
          data,
          // {
          //   id_conductor: id_conductor,
          // },
          { headers, responseType: 'blob' }
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }
  async GET_ImgWithAuth(endpoint: string) {
    try {
      const authToken = await Preferences.get({ key: Constants.AUTH_TOKEN });
      if (!authToken) {
        throw new Error('No se encontró el token de autorización');
      }
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken.value}`,
      });
      const response = await this.http
        .get(
          `${environment.apiUrl}${endpoint}`,
          { headers, responseType: 'blob' }
        )
        .toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

  async POST_WithAuth(endpoint: string, formData: any): Promise<any> {
    try {
      const authToken = await Preferences.get({ key: Constants.AUTH_TOKEN });

      if (!authToken) {
        throw new Error('No se encontró el token de autorización');
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken.value}`,
      });

      const response = await this.http
        .post<any>(`${environment.apiUrl}${endpoint}`, formData, { headers })
        .toPromise();
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error al obtener la informacion del perfil:', error);
      throw error; // Puedes manejar el error aquí o dejar que el componente lo maneje
    }
  }

  public POST_WithAuth2(endpoint: string, formData: any): Observable<any> {
    return from(Preferences.get({ key: Constants.AUTH_TOKEN })).pipe(
      switchMap((authToken) => {
        if (!authToken || !authToken.value) {
          throw new Error('No se encontró el token de autorización');
        }

        const headers = new HttpHeaders({
          Authorization: `Bearer ${authToken.value}`,
        });

        return this.http.post<any>(`${environment.apiUrl}${endpoint}`, formData, { headers });
      })
    );
  }

  async POST_NoAuth(endpoint: string, formData: any): Promise<any> {
    try {
      const response = await this.http
        .post<any>(`${environment.apiUrl}${endpoint}`, formData)
        .toPromise();
      console.log(response);
      return response;
    } catch (error) {
      console.error('Error al obtener la informacion del perfil:', error);
      throw error; // Puedes manejar el error aquí o dejar que el componente lo maneje
    }
  }
}
