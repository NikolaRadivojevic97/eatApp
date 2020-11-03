import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Place } from 'src/app/places/place.model';
import { Subscription } from 'rxjs';
import { PlacesService } from 'src/app/places/places.service';
import { MenuController, IonSegment } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { take } from 'rxjs/operators';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Recepie } from '../recepie.model';
import { RecepiesService } from '../recepies.service';

@Component({
  selector: 'app-all',
  templateUrl: './all.page.html',
  styleUrls: ['./all.page.scss'],
})
export class AllPage implements OnInit, OnDestroy {
  loadedRecepies: Recepie[];
  //listedLoadedPlaces: Place[];
  relevantRecepies: Recepie[] = [];
  isLoading = false;
  private recepieSub: Subscription;
  @ViewChild('segment',null) segment:IonSegment;


  constructor(
    private menuCtrl: MenuController,
    private recepiesService: RecepiesService
  ) {}


  ngOnInit() {
    this.recepieSub = this.recepiesService.recepies.subscribe(recepies => {
      this.loadedRecepies = recepies;
      this.relevantRecepies = this.loadedRecepies;

      //this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.recepiesService.fetchRecepies().subscribe(() => {
      this.isLoading = false;
      this.segment.value='all';
    });
  }

  onOpenMenu() {
    this.menuCtrl.toggle();
  }

  ngOnDestroy() {
    if (this.recepieSub) {
      this.recepieSub.unsubscribe();
    }
  }

  onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
      switch(event.detail.value) {
        case 'all':
          this.relevantRecepies = this.loadedRecepies;
          break;
        case 'breakfast':
          //console.log("breakfast");
          this.relevantRecepies = this.loadedRecepies.filter(
            recepie => {
              if(!recepie.tags) {
                return false;
              }
              return recepie.tags.includes('breakfast');
            } 
          );
          break;
        case 'lunch':
            this.relevantRecepies = this.loadedRecepies.filter(
              recepie => {
                if(!recepie.tags) {
                  return false;
                }
                return recepie.tags.includes('lunch');
              }
            );
            break;
        case 'dinner':
            this.relevantRecepies = this.loadedRecepies.filter(
              recepie => {
                if(!recepie.tags) {
                  return false;
                }
                return recepie.tags.includes('dinner');
              }
            );
          break;
        case 'vegetarian':
              this.relevantRecepies = this.loadedRecepies.filter(
                recepie => {
                  if(!recepie.tags) {
                    return false;
                  }
                  return recepie.tags.includes('vegetarian');
                }
            );
            break;
          case 'sweets':
              //console.log("breakfast");
              this.relevantRecepies = this.loadedRecepies.filter(
                recepie => {
                  if(!recepie.tags) {
                    return false;
                  }
                  return recepie.tags.includes('sweets');
                } 
              );
              break;
      }
  }

}
