import { Component, NgZone } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private ngZone: NgZone, private http: HttpClient) {
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

    let currentLevel = payload.current;
    let maxLevel = payload.maximum;
    let percentageLevel = currentLevel / maxLevel * 100;

    // set the percentage (label and botijao indicator)
    this.currentLevelPercentage = parseFloat(String(percentageLevel)).toFixed(2) + "%";

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
    this.http.get('https://api-simple.rounak.repl.co/sample/data').subscribe((response) => {
      console.log(response);
      this.updateLevelPercentage(response);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardPage');

    this.requestLevel();
    this.levelRequesterInterval = setInterval(() => {
      this.requestLevel();
    }, 100000) // 100000 means 10 mins
  }

}
