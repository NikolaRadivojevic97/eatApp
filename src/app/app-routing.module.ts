import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'recepies', pathMatch: 'full' },
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  {
    path: 'recepies',
    loadChildren: './recepies/recepies.module#RecepiesPageModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'ingredients',
    loadChildren: './ingredients/ingredients.module#IngredientsPageModule',
    canLoad: [AuthGuard]
  }, 
   {
    path: 'calories',
    loadChildren: './calories/calories.module#CaloriesPageModule',
    canLoad: [AuthGuard]
  }
/*,
  {
    path: 'recepies',
    loadChildren: () => import('./recepies/recepies.module').then( m => m.RecepiesPageModule)
  },
  {
    path: 'ingredients',
    loadChildren: () => import('./ingredients/ingredients.module').then( m => m.IngredientsPageModule)
  }*/
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
