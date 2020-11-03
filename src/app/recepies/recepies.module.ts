import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecepiesPageRoutingModule } from './recepies-routing.module';

import { RecepiesPage } from './recepies.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecepiesPageRoutingModule
  ],
  declarations: [RecepiesPage]
  
})
export class RecepiesPageModule {}
