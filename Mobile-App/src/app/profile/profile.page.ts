import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonSelect, NavController } from '@ionic/angular';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  profile_picture: any;
  profile_pictureSrc: string | undefined;

  email!: string;
  first_name!: string;
  last_name!: string;
  phone_number!: string;
  address!: string;
  emergency_contact_name!: string;
  emergency_contact_phone!: string;

  personal_id_front: any;
  personal_id_back: any;
  driver_license_front: any;
  driver_license_back: any;
  control_card_front: any;
  control_card_back: any;

  personal_id_front_src: string | undefined;
  personal_id_back_src: string | undefined;
  driver_license_front_src: string | undefined;
  driver_license_back_src: string | undefined;
  control_card_front_src: string | undefined;
  control_card_back_src: string | undefined;

  constructor(private navCtrl: NavController, private http: HttpService, private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    await this.http.GET_WithAuth('api/get-profile').then((response) => {
      console.log(response);
      this.email = response.email;
      this.first_name = response.first_name;
      this.last_name = response.last_name;
      this.phone_number = response.phone_number;
      this.address = response.address;
      this.emergency_contact_name = response.emergency_contact_name;
      this.emergency_contact_phone = response.emergency_contact_phone;
      this.personal_id_front = response.personal_id_front;
      this.personal_id_back = response.personal_id_back;
      this.driver_license_front = response.driver_license_front;
      this.driver_license_back = response.driver_license_back;
      this.control_card_front = response.control_card_front;
      this.control_card_back = response.control_card_back;
    });
    await this.http.GET_ImgWithAuth('api/get-profile-picture').then((imageBlob: any)=> {
      if (imageBlob) {
        this.profile_pictureSrc = URL.createObjectURL(imageBlob);
        this.cdr.detectChanges();
      }
    })

  }

  async takePicture() {
    // try {
    //   this.profile_picture = await Camera.getPhoto({
    //     quality: 90,
    //     allowEditing: true,
    //     resultType: CameraResultType.Uri,
    //     source: CameraSource.Camera,
    //   });
    //   this.profile_pictureSrc = this.profile_picture.webPath;
    // } catch (error) {
    //   console.error('Error al capturar la foto:', error);
    // }
  }
  async uploadDocument(document: string) {
    // await Camera.getPhoto({
    //   quality: 90,
    //   allowEditing: true,
    //   source: CameraSource.Camera,
    //   resultType: CameraResultType.Uri,
    // }).then((photo: any) => {
    //   switch (document) {
    //     case 'personal_id_front':
    //       this.personal_id_front = photo;
    //       this.personal_id_front_src = photo.webPath;
    //       break;
    //     case 'personal_id_back':
    //       this.personal_id_back = photo;
    //       this.personal_id_back_src = photo.webPath;
    //       break;
    //     case 'driver_license_front':
    //       this.driver_license_front = photo;
    //       this.driver_license_front_src = photo.webPath;
    //       break;
    //     case 'driver_license_back':
    //       this.driver_license_back = photo;
    //       this.driver_license_back_src = photo.webPath;
    //       break;
    //     case 'control_card_front':
    //       this.control_card_front = photo;
    //       this.control_card_front_src = photo.webPath;
    //       break;
    //     case 'control_card_back':
    //       this.control_card_back = photo;
    //       this.control_card_back_src = photo.webPath;
    //       break;
    //     default:
    //       console.error('Documento no reconocido:', photo);
    //   }
    // });
  }


  save() {
     this.navCtrl.pop();
  }
}
