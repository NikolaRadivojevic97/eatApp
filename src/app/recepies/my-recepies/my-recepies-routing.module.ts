import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyRecepiesPage } from './my-recepies.page';

const routes: Routes = [
  {
    path: '',
    component: MyRecepiesPage
  },
  {
    path: 'new',
    loadChildren: () => import('./new/new.module').then( m => m.NewPageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyRecepiesPageRoutingModule {}
