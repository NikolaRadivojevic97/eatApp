import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import {
  LoadingController,
  IonItemSliding,
  AlertController,
} from "@ionic/angular";
import { Calories } from "./calories.model";
import { CalorieService } from "./calorie.service";
import { Subscription } from "rxjs";
import { ActivityService } from "./activity.service";

@Component({
  selector: "app-calories",
  templateUrl: "./calories.page.html",
  styleUrls: ["./calories.page.scss"],
})
export class CaloriesPage implements OnInit, OnDestroy {
  loadedCalories: Calories[];
  isLoading = false;
  private itemSub: Subscription;
  totalCalories = 0;
  goalSet = false;
  goalCalories: number;

  constructor(
    private caloriesService: CalorieService,
    private loadingCtrl: LoadingController,
    private activityService: ActivityService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.caloriesService.items.subscribe((calories) => {
      this.loadedCalories = calories;
      this.totalCalories = 0;
      for (let calorie of this.loadedCalories) {
        if (this.getNumber(calorie.calories)) {
          this.totalCalories += this.getNumber(calorie.calories);
        }
      }
    });

    this.activityService.items.subscribe((activity) => {
      if (activity.length !== 0) {
        this.goalCalories = activity[0].calories;
        this.goalSet = true;
      } else {
        this.goalSet = false;
      }
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.itemSub = this.caloriesService.fetchItems().subscribe(() => {
      this.isLoading = false;
      this.activityService.fetchItems().subscribe(() => {
        if (this.totalCalories > this.goalCalories && this.goalSet) {
          this.alertCtrl
            .create({
              header: "You passed your daily goal",
              message: "Stop eating.",
              buttons: [{ text: "Okay" }],
            })
            .then((alertEl) => {
              alertEl.present();
            });
        }
      });
    });
  }

  ionViewDidEnter() {}

  getNumber(input: string) {
    let number: string = "";
    for (let i = 0; i < input.length; i++) {
      if (input[i] >= "0" || input[i] <= "9") {
        number += input[i];
      }
    }
    return parseInt(number);
  }

  submitForm(form: NgForm) {
    if(form.value["weight"]<40 || form.value["height"]<100){
      this.alertCtrl
            .create({
              header: "Enter valid data",
              message: "Height must be greather then 100 and weight muste be greater then 40",
              buttons: [{ text: "Okay" }],
            })
            .then((alertEl) => {
              alertEl.present();
            });
            return;
    }
    if (form.value["gender"] === "male") {
      this.goalCalories =
        form.value["weight"] * 12 +
        form.value["height"] * 5 +
        parseInt(form.value["activity"]) * 100;
      if (form.value["goal"] === "lose_weight") {
        this.goalCalories -= 200;
      } else {
        this.goalCalories += 200;
      }
    } else {
      this.goalCalories =
        form.value["weight"] * 8 +
        form.value["height"] * 5 +
        parseInt(form.value["activity"]) * 80;
      if (form.value["goal"] === "lose_weight") {
        this.goalCalories -= 150;
      } else {
        this.goalCalories += 150;
      }
    }
    console.log(this.goalCalories);
    this.activityService.addItem(this.goalCalories).subscribe(() => {
      this.goalSet = true;
    });
  }

  ngOnDestroy() {
    if (this.itemSub) {
      this.itemSub.unsubscribe();
    }
  }
}
