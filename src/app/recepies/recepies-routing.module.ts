import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecepiesPage } from './recepies.page';



const routes: Routes = [
  {
    path: 'tabs',
    component: RecepiesPage,
    children: [
      {
        path:'all',
        children: [
          {
            path: '',
            loadChildren: './all/all.module#AllPageModule'
          },
          {
            path:':recepieId',
            loadChildren: './all/recepie-detail/recepie-detail.module#RecepieDetailPageModule'
          }
        ]
      },
      {
        path:'my-recepies',
        children: [
          {
            path:'',
            loadChildren:'./my-recepies/my-recepies.module#MyRecepiesPageModule'
          },
          {
            path:'new',
            loadChildren:'./my-recepies/new/new.module#NewPageModule'
          },
          {
            path:'edit/:recepieId',
            loadChildren:'./my-recepies/edit/edit.module#EditPageModule'
          }         
        ]
      },
      {
      path:'',
      redirectTo: '/recepies/tabs/all',
      pathMatch:'full'          
      }
    ]
  },
  {
    path:'',
    redirectTo: '/recepies/tabs/all',
    pathMatch:'full'          
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecepiesPageRoutingModule {}
