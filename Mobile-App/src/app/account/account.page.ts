import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, ModalController, NavController } from '@ionic/angular';
import { APP_CONFIG, AppConfig } from '../app.config';
import { HttpService } from '../services/http.service';
import { AuthenticationService } from '../services/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  profileInfo: any;

  profile_picture: any;
  profile_pictureSrc: string | undefined;

  constructor(
    @Inject(APP_CONFIG) public config: AppConfig,
    private route: Router,
    private alertController: AlertController,
    private navCtrl: NavController,
    private authService: AuthenticationService,
    private http: HttpService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {}
  async ionViewWillEnter() {
    await this.http.GET_WithAuth('api/get-profile').then((response) => {
      this.profileInfo = response;
    });
    await this.http.GET_ImgWithAuth('api/get-profile-picture').then((imageBlob: any)=> {
      if (imageBlob) {
        this.profile_pictureSrc = URL.createObjectURL(imageBlob);
        this.cdr.detectChanges();
      }
    })
  }

  myProfile() {
    const navigationExtras: NavigationExtras = {
      state: {
        profileInfo: this.profileInfo,
      },
    };
    this.route.navigate(['./profile'], navigationExtras);
  }
  myRides() {
    this.route.navigate(['./my-rides']);
  }

  createSolicitude() {
    this.route.navigate(['./create-solicitude']);
  }
  
  ratings() {
    this.route.navigate(['./ratings']);
  }
  insights() {
    this.route.navigate(['./insights']);
  }

  getSupport() {
    this.route.navigate(['./get-support']);
  }
  async eliminarCuenta() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que deseas eliminar tu cuenta? Estos cambios no podran ser revertidos.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.http.GET_WithAuth('api/eliminar-cuenta');
            this.mostrarAlerta('Exito', 'Cuenta eliminada satisfactoriamente, gracias por usar Taxi Cajicá.');
            this.logout();
          },
        },
      ],
    });

    await alert.present();
  }
  private async mostrarAlerta(header: string, msj: string) {
    const alert = await this.alertController.create({
      header: header,
      message: msj,
      buttons: ['OK'],
    });
    await alert.present();
  }
  faqs() {
    this.route.navigate(['./faqs']);
  }
  selectLanguage() {
    this.route.navigate(['./select-language']);
  }
  termsConditions() {
    this.route.navigate(['./terms-conditions']);
  }

  logout() {
    this.authService.logout();
    this.navCtrl.navigateRoot(['./sign-in']);
  }

  developed_by() {
    window.open('https://pont.solutions/', '_system', 'location=no');
  }
}
