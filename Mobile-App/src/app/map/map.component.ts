import {
  Component,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
  OnInit,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { GoogleMapsService } from '../services/google-maps/google-maps.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MapComponent implements OnInit {
  @ViewChild('map', { static: true }) mapElementRef!: ElementRef;

  private watchId: any;
  private trackingActive: boolean = false;

  center: any = { lat: 4.441167508224369, lng: -75.22947759243051 };

  // Map Variables
  map: any;
  zoom = 18;

  originMarker: any = null; // Marker for origin address
  destineMarker: any = null; // Marker for destine address

  driver = { lat: 4.442884485309028, lng: -75.17216440303143 }; // vehicle location
  driverMarker: any = null; // Marker for vehicle

  private markers: any[] = []; // All markers
  private routes: any[] = []; // All routes

  // Google Maps Variables
  googleMaps: any;
  directionsService: any;
  directionsDisplay: any;

  destinationLatLng: any;
  currentLocation: any;

  constructor(
    private gmaps: GoogleMapsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  async ngAfterViewInit() {
    if (this.mapElementRef) {
      try {
        let googleMaps: any = await this.gmaps.loadGoogleMaps();
        this.googleMaps = googleMaps;
        const mapEl = this.mapElementRef.nativeElement;
        this.map = new googleMaps.Map(mapEl, {
          center: this.center,
          zoom: this.zoom,
          streetViewControl: false, // Desactivar el control de Street View
          mapTypeControl: false, // Desactivar el control de tipo de mapa (satelital, híbrido, etc.)
          zoomControl: false, // Desactivar el control de zoom
          fullscreenControl: false, // Desactivar el control de pantalla completa
          gestureHandling: 'greedy',
          disableDefaultUI: true,
          styles: [
            {
              featureType: 'transit',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }], // Ocultar etiquetas de transporte público
            },
            {
              featureType: 'landscape',
              elementType: 'all',
              stylers: [{ visibility: 'off' }], // Ocultar edificios
            },
          ],
        });
        console.log('Se cargo correctamente google maps');
        this.trackDriver(true);
      } catch (e) {
        console.log('failed to load map: ', e);
      }
    } else {
      console.error('mapElementRef is undefined');
    }
  }

  async showRouteFromDriverToPlace(destinationLatLng: any) {
    this.deleteAllRoutes();
    this.createMarker(destinationLatLng);

    const position = await Geolocation.getCurrentPosition();
    this.currentLocation = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }

    this.drawRoute(this.currentLocation, destinationLatLng);

    // Monitorea la ubicación del usuario
    Geolocation.watchPosition({}, (position) => {
      if (position!= null) {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        this.updateDriverPosition(this.currentLocation);
      }
    });
  }

  drawRoute(origin: any, destination: any) {
    // Usar Google Directions API para obtener la ruta
    // Implementa la lógica para llamar a la API y dibujar la ruta en el mapa
    const directionsService = new this.googleMaps.maps.DirectionsService();
    const directionsDisplay = new this.googleMaps.maps.DirectionsRenderer();
    directionsDisplay.setMap(this.map);

    directionsService.route(
      {
        origin: origin.toString(),
        destination: destination.toString(),
        travelMode: this.googleMaps.maps.TravelMode.DRIVING,
      },
      (response: any, status: any) => {
        if (status === this.googleMaps.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
        } else {
          console.log('Directions request failed due to ' + status);
        }
      }
    );
  }

  updateDriverPosition(latLng: any) {
    this.driverMarker.setPosition(latLng);
    this.map.animateCamera({
      target: latLng,
      zoom: 15,
    });

    // Vuelve a dibujar la ruta con la nueva posición del conductor
    this.drawRoute(latLng, this.destinationLatLng);
  }

  trackDriver(v: boolean) {
    try {
      if (!v) {
        this.stopTracking();
      } else {
        this.startTracking();
      }
    } catch (error) {
      console.log('Error al detener el seguimiento del conductor');
    }
  }

  private startTracking() {
    this.watchId = Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      },
      (position: any) => {
        if (position.coords) {
          const latLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          if (!this.driverMarker) {
            this.driverMarker = this.createMarker(
              latLng,
              'assets/images/icons/ic_user.png',
              true
            );
            this.map.moveCamera({ center: latLng });
          }
          this.driverMarker.setPosition(latLng);
        }
      }
    );
    this.trackingActive = true;
  }

  private stopTracking() {
    if (this.watchId) {
      this.watchId.unsubscribe();
      this.watchId = null;
      this.trackingActive = false;
    }
  }

  centerMapOnLocation(ubicacion: any) {
    console.log('Ejecutando centrarMapaEnUbicacion');
    if (!this.map || !ubicacion) {
      console.error(
        'No se puede centrar el mapa en la ubicación porque algunas variables no están inicializadas correctamente.',
        this.map,
        ubicacion
      );
      return;
    }
    this.map.setCenter(
      new this.googleMaps.LatLng(ubicacion.lat, ubicacion.lng)
    );
  }

  async setZoom(value: any) {
    this.map.setZoom(value);
  }

  loadDriversNearBy() {
    console.log('this.googleMaps: ', this.googleMaps);
    for (let i = 0; i < 3; i++) {
      const randomLat = this.center.lat + Math.random() * 0.015 - 0.008;
      const randomLng = this.center.lng + Math.random() * 0.015 - 0.008;
      this.createMarker(
        { lat: randomLat, lng: randomLng },
        'https://i.imgur.com/xgBYWSm.png',
        false
      );
    }
  }

  /**
   * Elimina todas las rutas renderizadas en el mapa
   */
  deleteAllRoutes() {
    console.log('Ejecutando deleteAllRoutes() ...');
    for (const ruta of this.routes) {
      console.log('ruta: ', ruta);
      ruta.setMap(null); // Elimina la ruta del mapa
    }
    this.directionsDisplay.setMap(null);
    this.routes = []; // Limpia el array de rutas
  }

  /**
   * Aniade un marcador a el mapa guardado en this.map y lo retorna
   * @param location: any = {lat: "", lng: ""}
   * @param image: string, url de la imagen
   * @param resize: boolean
   * @returns
   */
  createMarker(location: any, image: string = '', resize: boolean = true) {
    if (image == '') {
      const marker = new this.googleMaps.Marker({
        position: {
          lat: location.lat,
          lng: location.lng,
        },
        map: this.map,
      });
      this.markers.push(marker);
      return marker;
    }
    if (resize) {
      const marker = new this.googleMaps.Marker({
        position: {
          lat: location.lat,
          lng: location.lng,
        },
        map: this.map,
        icon: {
          url: image, // URL de la imagen del marcador
          scaledSize: new this.googleMaps.Size(60, 60), // Puedes ajustar este tamaño según necesites
        },
      });
      this.markers.push(marker);
      return marker;
    } else {
      const marker = new this.googleMaps.Marker({
        position: {
          lat: location.lat,
          lng: location.lng,
        },
        map: this.map,
        icon: {
          url: image, // URL de la imagen del marcador
        },
      });
      this.markers.push(marker);
      return marker;
    }
  }

  /**
   * Ajusta el mapa para incluir todos los marcadores en el arreglo.
   * @param markers: this.googleMaps.Marker[]
   */
  adjustMapToMarkers() {
    const bounds = new this.googleMaps.LatLngBounds();
    for (const marker of this.markers) {
      console.log(marker)
      bounds.extend(marker.getPosition()!);
    }
    // Ajustar el zoom del mapa a los límites
    this.map.fitBounds(bounds);
  }

  /**
   * Renderiza una ruta en el mapa almacenado en this.map.
   * @param origin any = {lat: "", lng: ""}
   * @param destine any = {lat: "", lng: ""}
   */
  renderRoute(origin: any, destine: any) {
    if (this.routes.length > 0) {
      this.deleteAllRoutes();
    }
    const directionsService = new this.googleMaps.DirectionsService();
    this.directionsDisplay = new this.googleMaps.DirectionsRenderer({
      suppressMarkers: true,
      preserveViewport: true,
      polylineOptions: {
        strokeColor: '#eb278f',
        strokeOpacity: 1.0,
        strokeWeight: 5,
      },
    });
    this.directionsDisplay.setMap(this.map);

    // TODO: CAMBIAR ESTO IMPORTANTISIMO
    const request = {
      origin: new this.googleMaps.LatLng(origin.lat, origin.lng),
      destination: new this.googleMaps.LatLng(destine.lat, destine.lng),
      travelMode: 'DRIVING',
    };

    directionsService.route(request, (response: any, status: any) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);

        // Obtener la ruta como una polilínea y agregarla al arreglo de rutas
        const route = new this.googleMaps.Polyline({
          path: response.routes[0].overview_path,
          strokeColor: '#eb278f',
          strokeOpacity: 1.0,
          strokeWeight: 5,
        });
        // Calcular el tamaño del ícono basado en el ancho de la línea
        const iconScale = route.get('strokeWeight') / 2; // Ajusta el divisor según sea necesario

        const icon = {
          path: this.googleMaps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 2, // Tamaño del ícono
          strokeColor: '#ed5ca9', // Color del ícono
        };

        // Configurar la animación del ícono
        route.setOptions({
          icons: [
            {
              icon: icon,
              offset: '0%',
              repeat: '400px',
            },
          ],
        });
        let count = 0;
        window.setInterval(() => {
          count = (count + 1) % 5000; // Controla la velocidad de la animación
          const icons = route.get('icons');
          icons[0].offset = count / 2 + '%';
          route.set('icons', icons);
        }, 20);
        route.setMap(this.map);
        this.routes.push(route); // Agregar la polilínea al arreglo de rutas
      } else {
        console.error('Error al calcular la ruta:', status);
      }
    });
  }

  deleteAllMarkers() {
    for (let marker of this.markers) {
      marker.setMap(null); // Elimina el marcador del mapa
    }
    this.markers = []; // Limpia el array de marcadores
  }
}
