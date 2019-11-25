import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { HomePage } from '../pages/home/home';
import { DetailPage } from '../pages/detail/detail';
import { ListWifiPage } from '../pages/list-wifi/list-wifi';
import { RegisterCustomerPage } from '../pages/register-customer/register-customer';
import { CreateAlertPage } from '../pages/create-alert/create-alert';

import { DashboardPage } from '../pages/dashboard/dashboard';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {ProgressBarModule} from "angular-progress-bar"
import {TimeAgoPipe} from 'time-ago-pipe';

import { BLE } from '@ionic-native/ble';
import { SocialSharing } from "@ionic-native/social-sharing";
import { Toast } from '@ionic-native/toast';
import { GoogleMaps } from '@ionic-native/google-maps';
import {SaveForLaterPage} from '../pages/save-for-later/save-for-later';
import {GoogleMapPage} from '../pages/google-map/google-map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Geolocation } from '@ionic-native/geolocation';

import { DataService } from '../providers/data/data';
import { IonicStorageModule } from '@ionic/storage';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    DashboardPage,
    TimeAgoPipe,
    HomePage,
    DetailPage,
    ListWifiPage,
    RegisterCustomerPage,
    CreateAlertPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    ProgressBarModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    DashboardPage,
    HomePage,
    DetailPage,
    ListWifiPage,
    RegisterCustomerPage,
    CreateAlertPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    BLE,
    DataService,
    SocialSharing,
    SQLite,
    Toast,
    GoogleMaps,
    Geolocation,
    Storage,
    Push
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
