import { Injectable, EventEmitter } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { environment } from 'src/environments/environment';
import { Geolocation } from '@capacitor/geolocation';
import { HttpClient } from '@angular/common/http';
import { Constants } from 'src/models/contants.models';

@Injectable({
  providedIn: 'root'
})
export class TripsPoolingService {

  private apiUrl = environment.apiUrl;
  private consultaIntervalo: Subscription = new Subscription();
  public respuestaExitosa = new EventEmitter<any>();

  constructor(private http: HttpClient) { }

  activarConsultaPeriodica(intervalo: number = 10000) {
    this.detenerConsultaPeriodica();

    // Iniciamos una consulta periódica con el intervalo proporcionado
    this.iniciarConsultaPeriodica(intervalo);
  }

  private iniciarConsultaPeriodica(intervalo: number): void {
    this.consultaIntervalo = interval(intervalo).subscribe(() => {
      this.realizarConsulta();
    });
  }

  private async realizarConsulta() {
    await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 60000,
    }).then(async (coordinates: any) => {
      try {
        const authToken = await Preferences.get({ key: Constants.AUTH_TOKEN });
        if (!authToken) {
          console.error('No se encontró el token de autorización');
          return;
        }

        const headers = {
          Authorization: `Bearer ${authToken.value}`,
        };

        this.http
          .post<any>(
            `${this.apiUrl}api/get-trips`,
            {
              latitude: coordinates.coords.latitude,
              longitude: coordinates.coords.longitude
            },
            { headers }
          )
          .subscribe(
            (response) => {
              // Maneja la respuesta del servidor
              this.respuestaExitosa.emit(response);
            },
            (error) => {
              console.error('Error en la consulta al servidor:', error);
              return null;
            }
          );
      } catch (e) {
        console.log('Error con el pooling de estado del viaje.', e);
      }
    });
  }

  // Detén la consulta periódica cuando ya no sea necesaria
  detenerConsultaPeriodica() {
    console.log('Deteniendo servicio de pooling de viajes');
    this.consultaIntervalo.unsubscribe();
  }
}
