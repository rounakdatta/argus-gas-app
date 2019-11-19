import { NgModule } from '@angular/core';
import { IonicPageModule } from "ionic-angular";
import { ListWifiPage } from "../list-wifi/list-wifi";


@NgModule({
    imports: [
        IonicPageModule.forChild(ListWifiPage)
    ],
    declarations: [
        ListWifiPage
    ],
    entryComponents: [
        ListWifiPage,
    ]
})
export class ListWifiModule { }