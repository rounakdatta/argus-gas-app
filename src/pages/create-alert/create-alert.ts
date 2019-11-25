import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the CreateAlertPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-alert',
  templateUrl: 'create-alert.html',
})
export class CreateAlertPage {

  deviceId: String;
  customerId: String;
  maximumWeight: String;

  alertPosition: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private http: HttpClient) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateAlertPage');

    // get the deviceId and the customerId from the local storage
    this.storage.get('deviceId').then((val) => {
      this.deviceId = val;
    })
    this.storage.get('customerId').then((val) => {
      this.customerId = val;
    })
    this.storage.get('maximumWeight').then((val) => {
      this.maximumWeight = val;
    })

  }

  createAlert() {

    // POST request to create the alert
    this.http.post('http://genesisapp.ml/kgas/api/set/alert/', {
        'deviceId': this.deviceId,
        'customerId': this.customerId,
        'alertLevel': this.alertPosition
    }).subscribe((response) => {
        console.log(response);
    });

  }

}
