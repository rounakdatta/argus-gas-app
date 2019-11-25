import { Component, NgZone } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';

import { CreateAlertPage } from '../create-alert/create-alert';

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  currentLevelPercentage: String = "loading";
  levelRequesterInterval: any;

  levelIndicatingColour: String = "#5dd55d";

  deviceId: String = "loading";
  wirelessNetwork: String = "loading";
  lastSeen: String = "loading";

  customerId: String;
  maximumWeight: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private ngZone: NgZone, private http: HttpClient, private storage: Storage) {
  }

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  updateLevelPercentage(payload) {
    console.log(payload.current);

    let currentLevel = payload.currentLevel;
    let maxLevel = payload.maximumLevel;
    let percentageLevel = currentLevel / maxLevel * 100;

    // set the percentage (label and botijao indicator)
    this.currentLevelPercentage = parseFloat(String(percentageLevel)).toFixed(2) + "%";

    // set all the other data
    this.deviceId = payload.deviceId;
    this.wirelessNetwork = payload.wirelessNetwork;
    this.lastSeen = payload.lastSeen;

    // set the color of the level meter
    if (percentageLevel >= 75) {
      this.levelIndicatingColour = "#5dd55d";
    } else if (percentageLevel >= 40 && percentageLevel < 75) {
      this.levelIndicatingColour = "#ffd633";
    } else if (percentageLevel >= 20 && percentageLevel < 40) {
      this.levelIndicatingColour = "#ff9933";
    } else {
      this.levelIndicatingColour = "#ff471a";
    }
  }

  requestLevel() {

    console.log(this.customerId);
    console.log(this.deviceId);

    this.http.get('http://genesisapp.ml/kgas/api/get/status/?c=' + this.customerId).subscribe((response) => {
      console.log(response);
      this.updateLevelPercentage(response);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');

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

    setTimeout(() => {
      this.requestLevel();
    }, 1000);

    this.levelRequesterInterval = setInterval(() => {
      this.requestLevel();
    }, 100000) // 100000 means 10 mins
  }

  gotoCreateAlertPage() {
    this.navCtrl.push(CreateAlertPage);
  }

}
