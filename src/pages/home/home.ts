import { BLE } from "@ionic-native/ble";
import { Component, NgZone } from "@angular/core";
import { NavController } from "ionic-angular";
import { ToastController, Platform, AlertController } from "ionic-angular";
import { DetailPage } from "../detail/detail";
declare var FCMPlugin: any;

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  devices: any[] = [];
  showMa: boolean = false;
  Madevcies: any[] = [];
  statusMessage: string;

  constructor(
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private ble: BLE,
    private ngZone: NgZone,
    private platform: Platform,
    private alert: AlertController
  ) {
    this.onNotification();
  }

  async onNotification() {
    try {
      await this.platform.ready();

      FCMPlugin.onNotification(
        (data: any) => {
          this.alert.create(data).present();
        },
        error => {
          console.log(error);
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  ionViewDidEnter() {
    console.log("ionViewDidEnter");
    console.log("We are about to scan");
    this.platform.ready().then(() => this.scan());
    // this.push();
  }

  scan() {
    this.setStatus("Scanning for Bluetooth LE Devices");
    this.devices = []; // clear list
    this.showMa = false;
    //   this.Madevcies = [];

    this.ble
      .scan([], 5)
      .subscribe(
        device => this.onDeviceDiscovered(device),
        error => this.scanError(error)
      );

    setTimeout(this.setStatus.bind(this), 5000, "Scan complete now");
  }

  onDeviceDiscovered(device) {
    if (
      (device["name"] &&
      device["name"][0] == "M" &&
      device["name"][1] == "A"
       )
        ||
       (
        device["name"] &&
        device["name"][0] == "E" &&
        device["name"][1] == "S" &&
        device["name"][2] == "P"
        ) 
    ) {
      console.log("Discovered " + JSON.stringify(device, null, 2));

      this.ngZone.run(() => {
        this.devices.push(device);
      });
    }
  }

  // If location permission is denied, you'll end up here
  scanError(error) {
    this.setStatus("Error " + error);
    let toast = this.toastCtrl.create({
      message: "Click on Scan...",
      position: "middle",
      duration: 5000
    });
    toast.present();
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  deviceSelected(device) {
    console.log(JSON.stringify(device) + " selected");
    this.navCtrl.push(DetailPage, {
      device: device
    });
  }
}
