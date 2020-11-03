import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllPage } from './all.page';

const routes: Routes = [
  {
    path: '',
    component: AllPage
  },
  {
    path: 'recepie-detail',
    loadChildren: () => import('./recepie-detail/recepie-detail.module').then( m => m.RecepieDetailPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllPageRoutingModule {}
