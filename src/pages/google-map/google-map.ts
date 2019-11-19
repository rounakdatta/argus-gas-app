import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import {GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 LatLng,
 CameraPosition,
 MarkerOptions,
 Marker} from '@ionic-native/google-maps';

/**
 * Generated class for the GoogleMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-google-map',
  templateUrl: 'google-map.html',
})
    
export class GoogleMapPage {
    //map variables
    @ViewChild('map') mapElement: ElementRef;
    map: GoogleMap;
    
    latitude: any;
    longitude: any;
    
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public platform: Platform
                ) 
              {
                this.latitude = navParams.get("lat");
                this.longitude = navParams.get("long");
              }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GoogleMapPage');
  }
    
    ngAfterViewInit(){
        this.platform.ready().then( () => {
            this.initMap();    
        });

    }
    

    initMap(){
    let element = this.mapElement.nativeElement;
    console.log("ELEMENT:::: ");
    console.log(element);
    this.map = GoogleMaps.create('map');
        
    this.map.one(GoogleMapsEvent.MAP_READY).then(
       () => {
         console.log('Map is ready!');
         let coordinates: LatLng = new LatLng( this.latitude, this.longitude);

            let position = {
                target: coordinates,
                zoom: 14
            };

            this.map.animateCamera( position );

            let markerOptions: MarkerOptions = {
                position: coordinates,
                icon: "assets/images/marker.png",
                title: 'Position'
            };

            const marker = this.map.addMarker( markerOptions )
            .then( ( marker: Marker ) => {
                marker.showInfoWindow();
            });
       }
     );

    }
    
    loadMap() {
     // make sure to create following structure in your view.html file
     // and add a height (for example 100%) to it, else the map won't be visible
     // <ion-content>
     //  <div #map id="map" style="height:100%;"></div>
     // </ion-content>
    
     // create a new map by passing HTMLElement
     let element: HTMLElement = document.getElementById('map');
    
     let maps: GoogleMap = GoogleMaps.create(element);
    
     // listen to MAP_READY event
     // You must wait for this event to fire before adding something to the map or modifying it in anyway
         }
    
}
