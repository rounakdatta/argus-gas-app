import {Component, NgZone} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, Platform} from 'ionic-angular';

import { BLE } from '@ionic-native/ble';

import { DashboardPage } from "../dashboard/dashboard";
import { RegisterCustomerPage } from "../register-customer/register-customer";

// Bluetooth UUIDs
const SERVICE = 'ffe0';
const CHARACTERISTIC = 'ffe1';

/**
 * Generated class for the ListWifiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-list-wifi',
  templateUrl: 'list-wifi.html',
})
export class ListWifiPage {
  DeviceNameHeader: String = "NULL";
  deviceDetails: any = {};

  tempString : any = [];
  finalString : any = [];
  arr:any = [];
  wifiSelect: String;
  wifiPassword: String = "";
  selectedNetwork: String = "NULL";
  wifiRequest: boolean = false;
  wifiConnected: boolean = false;

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  wifiChecker: any;

  localStorage: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private platform: Platform, private ble: BLE, private ngZone: NgZone) {
    // let deviceName = navParams.get('deviceName');

    // we are taking the details from the file and just printing it on a variable in the html here
    this.deviceDetails = navParams.get('deviceDetails');
    this.DeviceNameHeader = this.deviceDetails.name;
    // this.showAlert('ble id', this.deviceDetails.id);

    // this.ble.connect(this.deviceDetails.id).subscribe(
    //     peripheral => this.onConnected(peripheral),
    //     peripheral => this.showAlert('Disconnected', 'The peripheral unexpectedly disconnected')
    // );

    // this.startLooking();

  }
 
  hideShowPassword() {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  convertStringToArrayBuffer(foo) {
    let buf = new ArrayBuffer(foo.length * 2);
    let bufView = new Uint16Array(buf);

    for (let i = 0, strLen = foo.length; i < strLen; i++) {
      bufView[i] = foo.charCodeAt(i);
    }

    return buf;
  }

    // as soon as the connection is re-established in this new page
  onConnected(peripheral) {
    // this.showAlert("Status", "Connection established");

    // Subscribe for notifications when the list of wifi networks is returned
    this.ble.startNotification(this.deviceDetails.id, SERVICE, CHARACTERISTIC).subscribe(
        //  data => this.info = data,
        data  => this.onListWifiDetailsReceived(data),
        data => this.showAlert("error", data),


//data => console.log('Data looks like that ' + data + 'Arrayed data like that ' + JSON.parse(data)) ,
        () => this.showAlert("Status", "failed to subscribe")


    )

    // sending a message called lwn (list wifi networks)
    // this.showAlert("Status", "sending now");
    let lwnMessage: ArrayBuffer = this.convertStringToArrayBuffer('lwn');
    this.ble.write(this.deviceDetails.id, SERVICE, CHARACTERISTIC, lwnMessage);
    // this.showAlert("Status", "Message sent to esp");
    // this.showAlert("peripheral", this.deviceDetails.id);

    // this.tempString = "";
    // this.finalString = "";
    // this.arr = [];
    //
    //
    // this.peripheral = peripheral;
    // this.setStatus('Connected to ' + (peripheral.name || peripheral.id));

  }

  onListWifiDetailsReceived(buffer: ArrayBuffer) {

    var data = new Uint8Array(buffer);
    var strr = String.fromCharCode.apply(null, data);
    console.log("string data " + strr);
    // this.showAlert("somedatareceived1", strr);

    if (this.wifiRequest) {
      // this.showAlert("somedatareceived1", strr);
      if (strr[0] == "Y") {
        this.showAlert("WiFi Connection", "Success! :)");
        this.wifiConnected = true;

        // stop the wifi checker before moving on to the new page
        clearInterval(this.wifiChecker);

        // move to the upgrade page
        //this.openDashboardPage();

        // set configured as true
        // this.localStorage.set('firstSetup', 'true');
      } else {
        this.showAlert("WiFi Connection", "Failed! :(");
      }
      this.wifiRequest = false;
    }

    if (strr[0] == "{" ){

      this.arr = [];
      this.tempString = strr;

    } else if (strr[(strr.length)-1] != "}"){

      this.tempString = this.tempString.concat(strr);

    } else if (strr[(strr.length)-1] == "}") {

      // when i receive the last character of the json

      this.finalString = this.tempString.concat(strr);
      this.tempString = "";
      // this.showAlert("finalString", this.finalString);

      var str0 = this.finalString.split("{")[1];
      var str1 = str0.split("}")[0];
      this.arr = str1.split(",");

      // this.showAlert("net", this.arr);


      this.ngZone.run(() => {
        // this.Network1 = this.arr[0];
        // this.Network2 = this.arr[1];

        // for(let i=0; i < this.arr.length; i++){
        //   this.networksArray.push(this.arr[i]);
        // }
        //
        // this.showAlert("networksArray", this.networksArray);

      });

    }
    else{
      console.log("Problem with String")
    }
//this.SaveData();
  }


  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad ListWifiPage');

    setTimeout(() => 
    {
        this.startLooking();
    },
    3000);

    this.wifiChecker = setInterval(() => 
    {
        this.startLooking();
    },
    25000);
    
  }

  startLooking() {

    // await this.platform.ready();
    // this.showAlert("connecting to", this.deviceDetails.id)

    this.ble.connect(this.deviceDetails.id).subscribe(
        peripheral => this.onConnected(peripheral),
        peripheral => this.showAlert('Disconnected', 'The peripheral unexpectedly disconnected')
    );
  }

  showSelectValue(wifiSelect: String) {
    // this.showAlert("Selected network", wifiSelect);
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  connectToNetwork(wifiPassword: String, selectedNetwork: String) {
    selectedNetwork = selectedNetwork.trim();

    // send the wifi ssid details
    let buf1: ArrayBuffer = this.convertStringToArrayBuffer("$" + selectedNetwork);
    this.ble.write(this.deviceDetails.id, SERVICE, CHARACTERISTIC, buf1);

    this.delay(500);

    // send the wifi password details
    let buf2: ArrayBuffer = this.convertStringToArrayBuffer("%" + wifiPassword);
    this.ble.write(this.deviceDetails.id, SERVICE, CHARACTERISTIC, buf2);

    this.delay(500);

    // wifi connect request (wcr) is to notify that we'll send future messages to connect
    let wcrMessage: ArrayBuffer = this.convertStringToArrayBuffer('wcr');
    this.ble.write(this.deviceDetails.id, SERVICE, CHARACTERISTIC, wcrMessage);

    this.wifiRequest = true;
  }

  openDashboardPage() {

      this.navCtrl.push(DashboardPage, {
        deviceDetails: this.deviceDetails
      })
    }

    openRegisterPage() {

      this.navCtrl.push(RegisterCustomerPage, {
        deviceDetails: this.deviceDetails
      })
    }

}
