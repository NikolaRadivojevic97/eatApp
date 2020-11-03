import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecepieDetailPage } from './recepie-detail.page';

const routes: Routes = [
  {
    path: '',
    component: RecepieDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecepieDetailPageRoutingModule {}
