import { Component, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { BLE } from '@ionic-native/ble';
import {SocialSharing} from "@ionic-native/social-sharing";
import {SaveForLaterPage} from '../save-for-later/save-for-later';
import {GoogleMapPage} from '../google-map/google-map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Geolocation } from '@ionic-native/geolocation';

import { ListWifiPage } from "../list-wifi/list-wifi";


// Bluetooth UUIDs
const SERVICE = 'ffe0';
const CHARACTERISTIC = 'ffe1';

const CANADA_TEMP_UNIT = 'C';
const US_TEMP_UNIT = 'F';

const CANADA_TEST_WEIGHT_UNIT = 'g/0.5L';
const US_TEST_WEIGHT_UNIT = 'lb/bu';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  peripheral: any = {};
  temperature: number;
  Name:string;
  Moisture:number;
  statusMessage: string;
  nameOne:string;
  nameTwo : string;
  TW :  string;
  msg:string;
  latitude: any;
  longitude: any;
  temp_unit: string;
  test_weght_unit: string;

//  info : Ibeacon[] = [];
  arr:any = [];
//  arrTest:any = ['Winter','17.2','32','nameOne','nameTwo'];

  savedData : any = [];
//   tempString = "";
  // finalString = "";
  tempString : any = [];
  finalString :any = [];
  d: Date =  new Date();
  time : any;

  deviceDetails: any = {};


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private ble: BLE,
              private alertCtrl: AlertController,
              private ngZone: NgZone,
              public socialSharing: SocialSharing,
              private sqlite:SQLite,
              private _geoloc: Geolocation
              ) {

    let device = navParams.get('device');
    this.deviceDetails = device;

    this.setStatus('Connecting to ' + device.name || device.id);

    // This is not a promise, the device can call disconnect after it connects, so it's an observable
    this.ble.connect(device.id).subscribe(
      peripheral => this.onConnected(peripheral),
      peripheral => this.showAlert('Disconnected', 'The peripheral unexpectedly disconnected')
    );
    this.time = this.d.toLocaleString();


// // test data
//      this.Name = "Hard Red Spring wheat";
//       this.Moisture = 5;
//       this.temperature = 23;
//       this.nameOne =  "21312312";
//      this.nameTwo = "1234576";
  }


  ionViewDidLoad() {
    this.createTable();
    console.log("Table created")

  }

  convertStringToArrayBuffer(foo) {
    let buf = new ArrayBuffer(foo.length * 2);
    let bufView = new Uint16Array(buf);

    for (let i = 0, strLen = foo.length; i < strLen; i++) {
      bufView[i] = foo.charCodeAt(i);
    }

    return buf;
  }

  // the connection to the peripheral was successful
  onConnected(peripheral) {
    this.tempString = "";
    this.finalString = "";
    this.arr = [];


    this.peripheral = peripheral;
    this.setStatus('Connected to ' + (peripheral.name || peripheral.id));

    // Subscribe for notifications when the temperature changes
    this.ble.startNotification(this.peripheral.id, SERVICE, CHARACTERISTIC).subscribe(
    //  data => this.info = data,
     data  => this.onTemperatureChange(data),
     data => console.log(data),


//data => console.log('Data looks like that ' + data + 'Arrayed data like that ' + JSON.parse(data)) ,
      () => console.log('Unexpected Error', 'Failed to subscribe for changes')


    )

    let mdMessage: ArrayBuffer = this.convertStringToArrayBuffer('md');
    this.ble.write(this.deviceDetails.id, SERVICE, CHARACTERISTIC, mdMessage);
    // this.showAlert("Status", "Message sent to esp");

  }

    getGeolocation(){
        return this._geoloc.getCurrentPosition() ;   
    }

  onTemperatureChange(buffer:ArrayBuffer) {

    var data = new Uint8Array(buffer);
    var strr = String.fromCharCode.apply(null, data);
    console.log("string data " + strr);

  if (strr[0] == "{" ){

    this.tempString = strr;

  }else if (strr[(strr.length)-1] != "}"){

   this.tempString= this.tempString.concat(strr);

  }else if (strr[(strr.length)-1] == "}"){

  this.finalString = this.tempString.concat(strr);

  this.tempString = "";

  var str0 = this.finalString.split("{")[1];
  var str1 = str0.split("}")[0];
  this.arr = str1.split(",");

  this.temp_unit = CANADA_TEMP_UNIT;
  this.test_weght_unit = CANADA_TEST_WEIGHT_UNIT;
  if(this.arr[6] == '1')
    {
      this.temp_unit = US_TEMP_UNIT;
      this.test_weght_unit = US_TEST_WEIGHT_UNIT;
     } 

    for(var i = 0; i < this.arr.length; i++) {
    console.log(this.arr[i]);

      }
    
    this.ngZone.run(() => {
        this.Name = this.arr[0];
        this.Moisture = this.arr[1];
        this.temperature = this.arr[2];
        this.nameOne =  this.arr[3];
        this.nameTwo = this.arr[4];
        this.TW = this.arr[5];
        this.temp_unit;
        this.test_weght_unit;
        this.time

    });

  //  return Promise.resolve(this.arr)
  this.something();
  console.log("Data inserted once")

  }

  else{
  console.log("Problem with String")
  }
//this.SaveData();
}


 something = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            // do something
            this.getGeolocation().then(res =>{
                    console.log(res.coords.latitude);
                    console.log(res.coords.longitude);
                    this.latitude = res.coords.latitude;
                    this.longitude = res.coords.longitude;
                    this.insertData();
                    }
                ).catch(err => {console.log(err);});

        }
    };
})();



  createTable(){
    this.sqlite.create({

      name:'ionicdb.db',
      location:'default'
    }).then((db:SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS Data(rowid INTEGER PRIMARY KEY ,name TEXT ,moisture TEXT,temperature TEXT, nameOne TEXT,nameTwo TEXT, TW TEXT, time TEXT , lat TEXT, long TEXT, countryId TEXT)')
      .then(res => console.log('Executed SQL'))
      .catch(e => console.log (e));

    }).catch(e => console.log(e));
  }

  insertData(){
    this.sqlite.create({
      name:'ionicdb.db',
      location:'default'
    }).then((db:SQLiteObject) => {
      db.executeSql('INSERT INTO Data VALUES(NULL,?,?,?,?,?,?,?,?,?,?)',[this.arr[0],
      this.arr[1],this.arr[2],this.arr[3],this.arr[4],this.arr[5],this.time, this.latitude, this.longitude, this.arr[6]])
      .then(res => {
        console.log("Data saved successfully to DB" + res);

      })
      .catch(e => console.log (e));
    })
  }



//}
  // Disconnect peripheral when leaving the page
  ionViewWillLeave() {
    console.log('ionViewWillLeave disconnecting Bluetooth');
    this.ble.disconnect(this.peripheral.id).then(
    //  () => console.log('Disconnected ' + JSON.stringify(this.peripheral)),
    () => console.log('Disconnected '),
  //    () => console.log('ERROR disconnecting ' + JSON.stringify(this.peripheral))
     () => console.log('ERROR disconnecting ')
    )
  //  this.arr = []



  }

  showAlert(title, message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  setStatus(message) {
    console.log(message);
    this.ngZone.run(() => {
      this.statusMessage = message;
    });
  }

  //save(){
  //  this.dataS.save(this.arr);

  //}

  PushToSavePage(){
      this.navCtrl.push(SaveForLaterPage);
  }
  
  PushToMapPage(){
      console.log('Open map..');
    this.navCtrl.push(GoogleMapPage, {
      lat:this.latitude,
      long: this.longitude
    });    
  }

  compilemsg():string{
   this.msg = "Moisture: " + this.arr[1] + "%"  +  "\n"  + "Temperature: " +  this.arr[2] + "°C" + "\n" +"Name: " + this.arr[0] + "\n" + "Id 01: " + this.arr[3]
   + "\n"+ "Id 02: " + this.arr[4] + "\n"  + "Test Weight: " + this.arr[5] + "g/0.5L"  ;
  return this.msg.concat("\n \nThank you for choosing PGA Moisture Analyzers!");

 }



   shareResults() {
     this.msg = this.compilemsg();
     let alert = this.alertCtrl.create({
       title: 'Results',
       message: 'Would you like to share your results?',
       buttons: [
         {
           text: 'No, Thanks'
         },
         {
           text: 'Share',
           handler: _=> {
             this.socialSharing.share(this.msg, null, null, null);
             console.log( " here the shared message "+ this.msg)
           }
         }
       ]
     });
     alert.present();
   }

  ListWifiNetworks() {
    this.navCtrl.push(ListWifiPage, {
      deviceName: this.peripheral.name,
      deviceDetails: this.deviceDetails
    })
  }
}
