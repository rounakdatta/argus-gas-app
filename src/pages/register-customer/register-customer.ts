import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { DashboardPage } from "../dashboard/dashboard";
import { Storage } from '@ionic/storage';

/**
 * Generated class for the RegisterCustomerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register-customer',
  templateUrl: 'register-customer.html',
})
export class RegisterCustomerPage {

  deviceDetails: any = {};

  customerId: string;
  deviceId: string;
  maximumWeight: string;

  registrationComplete: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, private storage: Storage) {
    this.deviceDetails = navParams.get('deviceDetails');

    this.deviceId = this.deviceDetails.name;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterCustomerPage');
  }

  registerCustomer() {
      this.http.post('http://genesisapp.ml/kgas/api/register/customer/', {
        'deviceId': this.deviceId,
        'customerId': this.customerId,
        'maximumWeight': this.maximumWeight
    }).subscribe((response) => {
        console.log(response);
        this.registrationComplete = true;
    });

    // store the registration details in local storage
    this.storage.set('deviceId', this.deviceId);
    this.storage.set('customerId', this.customerId);
    this.storage.set('maximumWeight', this.maximumWeight);
  }

  openDashboardPage() {

    this.navCtrl.push(DashboardPage, {
      deviceDetails: this.deviceDetails
    })
  }

}
