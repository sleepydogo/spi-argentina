import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoogleMapsService {

  constructor() { }

  loadGoogleMaps(): Promise<any> {
    const win = window as any;
  
    // Verifica si google.maps ya está definido
    if (win.google && win.google.maps) {
      return Promise.resolve(win.google.maps);
    }
  
    // Si no está definido, devuelve una promesa que se resolverá cuando el SDK esté disponible
    return new Promise((resolve, reject) => {
      // Maneja el caso en que el SDK se cargue de forma asíncrona después de la inicialización del servicio
      win['onGoogleMapsReady'] = () => {
        resolve(win.google.maps);
      };
  
      // Rechaza la promesa si después de un tiempo el SDK aún no está disponible
      setTimeout(() => {
        reject('Google Map SDK is not Available');
      }, 1); // Ajusta el tiempo límite según sea necesario
    });
  }
}
