import { Component, OnInit } from "@angular/core";
import { Recepie } from "../../recepie.model";
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, AlertController, IonItemSliding } from '@ionic/angular';
import { RecepiesService } from '../../recepies.service';
import { AuthService } from 'src/app/auth/auth.service';
import { take, switchMap } from 'rxjs/operators';
import { Ingredients } from 'src/app/ingredients/ingredients.model';
import { IngredientsService } from 'src/app/ingredients/ingredients.service';
import { CalorieService } from 'src/app/calories/calorie.service';

@Component({
  selector: "app-recepie-detail",
  templateUrl: "./recepie-detail.page.html",
  styleUrls: ["./recepie-detail.page.scss"],
})
export class RecepieDetailPage implements OnInit {
  recepie: Recepie = new Recepie("","","","", "", [], [], [],"","");
  //isBookable = false;
  //placeSub: Subscription;
  isLoading = false;
  user: string;


  constructor(
    private route: ActivatedRoute, private navCtrl: NavController, 
    private recepiesService: RecepiesService, private authService: AuthService,
    private alertCtrl: AlertController, private router: Router,
    private ingredientService: IngredientsService,private caloriesService: CalorieService,
    ) {}

    ngOnInit() {
      this.route.paramMap.subscribe(paramMap => {
        if(!paramMap.has('recepieId')) {
          this.navCtrl.navigateBack('/recepies/tabs/all');
          return;
        }
        this.isLoading= true;
        this.recepiesService.getRecepie(paramMap.get('recepieId'))
        .subscribe(recepie => {
          this.recepie = recepie;
          this.isLoading = false;
        }, error => {
          this.alertCtrl.create({header:'An error occurred', message:'Could not load recepies.',
        buttons:[{text:'Okay', handler: () => {
          this.router.navigate(['/recepies/tabs/all']);
        }}]}).then(alertEl => {
          alertEl.present();
        });
        });
      });     
  }

  onAddIngredient(ingredient: Ingredients, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.ingredientService.addItem(ingredient).subscribe();
  }

  eaten(recepie: Recepie) {
    this.caloriesService.addItem(recepie.title, recepie.calories, recepie.imageUrl).subscribe(()=> {
      this.alertCtrl.create({header:'Added to Calories', message:'You finished eating.',
      buttons:[{text:'Okay', handler: () => {
        this.router.navigate(['/calories']);
      }}]}).then(alertEl => {
        alertEl.present();
      });
    });

  }

  
}

