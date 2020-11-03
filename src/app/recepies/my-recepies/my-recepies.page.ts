import { Component, OnInit } from '@angular/core';
import { Recepie } from '../recepie.model';
import { RecepiesService } from '../recepies.service';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-my-recepies',
  templateUrl: './my-recepies.page.html',
  styleUrls: ['./my-recepies.page.scss'],
})
export class MyRecepiesPage implements OnInit {

  recepies: Recepie[];
  myRecepies: Recepie[] = [];
  private recepieSub: Subscription;
  isLoading = false;

  constructor(private recepiesService: RecepiesService, private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.authService.userId.pipe(take(1)).subscribe(userId => {      
      this.recepieSub = this.recepiesService.recepies.subscribe(recepies => {
        this.recepies = recepies
        this.myRecepies = this.recepies.filter(recepie => {
          return recepie.userId === userId;
        });
      });
    })    
    this.recepiesService.fetchRecepies().subscribe(() => {
      this.isLoading = false;
    });
  }

  onEdit(placeId:string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/','recepies','tabs','my-recepies','edit',placeId]);
  }

}
