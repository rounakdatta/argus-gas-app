import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

import { HomePage } from '../home/home';
import { DashboardPage } from '../dashboard/dashboard';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  isConfigured: boolean = false;

  constructor(public navCtrl: NavController, private storage: Storage) {

  }


  ionViewDidLoad() {
    this.storage.get('deviceId').then((val) => {
      if (val != null && val != undefined) {
        this.isConfigured = true;
      } else {
        this.isConfigured = false;
      }
    })
  }

  gotoSettings() {
    this.navCtrl.push(HomePage);
  }

  gotoDashboard() {
    this.navCtrl.push(DashboardPage);
  }
}
