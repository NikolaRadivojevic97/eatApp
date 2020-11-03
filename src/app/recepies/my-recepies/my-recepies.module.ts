import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyRecepiesPageRoutingModule } from './my-recepies-routing.module';

import { MyRecepiesPage } from './my-recepies.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyRecepiesPageRoutingModule
  ],
  declarations: [MyRecepiesPage]
})
export class MyRecepiesPageModule {}
