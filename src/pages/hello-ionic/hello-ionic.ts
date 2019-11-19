import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

import { HomePage } from '../home/home';
import { DashboardPage } from '../dashboard/dashboard';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  constructor(public navCtrl: NavController,) {

  }

  gotoSettings() {
    this.navCtrl.push(HomePage);
  }

  gotoDashboard() {
    this.navCtrl.push(DashboardPage);
  }
}
