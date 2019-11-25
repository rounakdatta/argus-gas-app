import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RegisterCustomerPage } from './register-customer';

@NgModule({
  declarations: [
    RegisterCustomerPage,
  ],
  imports: [
    IonicPageModule.forChild(RegisterCustomerPage),
  ],
})
export class RegisterCustomerPageModule {}
