import { Injectable } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private locationUpdateInterval: Subscription | undefined;
  private readonly updateIntervalMs = 10000; // 10 seconds

  constructor(private http: HttpService) {}

  // Función para activar el servicio de ubicación
  public activateLocationTracking(): Observable<any> {
    return new Observable(observer => {
      this.locationUpdateInterval = interval(this.updateIntervalMs).subscribe(async () => {
        const position = await this.getCurrentPosition();
        if (position) {
          this.sendLocationToServer(position).subscribe(
            response => {
              observer.next(response); // Emitir la respuesta del servidor
            },
            error => {
              observer.error(error); // Emitir el error si ocurre
            }
          );
        }
      });
    });
  }

  // Función para desactivar el servicio de ubicación
  public deactivateLocationTracking() {
    if (this.locationUpdateInterval) {
      this.locationUpdateInterval.unsubscribe();
    }
  }

  // Función para obtener la ubicación actual
  private async getCurrentPosition(): Promise<{ latitude: number; longitude: number } | null> {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      return {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude
      };
    } catch (error) {
      console.error('Error al obtener la ubicación', error);
      return null;
    }
  }

  // Función para enviar la ubicación al servidor
  private sendLocationToServer(position: { latitude: number; longitude: number }): Observable<any> {
    return this.http.POST_WithAuth2('api/current-trip-driver', position);
  }
}
