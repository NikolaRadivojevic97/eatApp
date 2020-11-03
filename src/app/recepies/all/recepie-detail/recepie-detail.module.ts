import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecepieDetailPageRoutingModule } from './recepie-detail-routing.module';

import { RecepieDetailPage } from './recepie-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecepieDetailPageRoutingModule
  ],
  declarations: [RecepieDetailPage]
})
export class RecepieDetailPageModule {}
