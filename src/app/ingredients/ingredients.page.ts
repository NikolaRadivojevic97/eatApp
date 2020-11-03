import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { IngredientsService } from './ingredients.service';
import { Ingredients } from './ingredients.model';
import { ShoppingListItem } from './shopping-list-item.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.page.html',
  styleUrls: ['./ingredients.page.scss']
})

export class IngredientsPage implements OnInit {
  loadedIngredients: ShoppingListItem[];
  isLoading = false;
  //private itemSub: Subscription;

  constructor(
    private ingreientsService: IngredientsService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
     this.ingreientsService.items.subscribe(ingredients => {
       this.loadedIngredients = ingredients;
     });
  }

  onCancelIngredient(id: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingCtrl.create({ message: 'Cancelling...' }).then(loadingEl => {
      loadingEl.present();
      this.ingreientsService.cancelItem(id).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.ingreientsService.fetchItems().subscribe(() => {
      this.isLoading = false;
    });
  }
}