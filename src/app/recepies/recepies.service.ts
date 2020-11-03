import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, of } from "rxjs";
import { take, map, tap, delay, switchMap } from "rxjs/operators";

import { AuthService } from "../auth/auth.service";
import { Recepie } from "./recepie.model";
import { Ingredients } from "../ingredients/ingredients.model";

interface RecepieData {
  description: string;
  imageUrl: string;
  ingredients: Ingredients[];
  tags: String[];
  title: string;
  userId: string;
  steps: String[];
  calories: string;
  time: string;
}

@Injectable({
  providedIn: "root",
})
export class RecepiesService {

  

  private _recepies = new BehaviorSubject<Recepie[]>([]);

  constructor(private authService: AuthService, private http: HttpClient) {}

 /* get recepies() {
    return this._recepies;
  }*/


  get recepies() {
    return this._recepies.asObservable();
  }
  

  getRecepie(id: string) {
    return this.authService.token.pipe(take(1), switchMap(token => {
      return this.http
      .get<RecepieData>(
        `https://ionic-angular-project-83cb0.firebaseio.com/recepies/${id}.json?auth=${token}`
      )        
    }),
        map(recepieData => {
          return new Recepie(
            id,
            recepieData.title,
            recepieData.description,
            recepieData.imageUrl,
            recepieData.userId,
            recepieData.ingredients,
            recepieData.tags,
            recepieData.steps,
            recepieData.calories,
            recepieData.time
          );
        })
      );
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);
    console.log(uploadData);

    return this.authService.token.pipe(take(1),switchMap(token => {
      return this.http.post<{ imageUrl: string; imagePath: string }>(
        'https://us-central1-ionic-angular-project-83cb0.cloudfunctions.net/storeImage',
        uploadData, {headers: {Authorization: 'Bearer ' + token }}
      );
    }));
  }

  addRecepie(
    title: string,
    description: string,
    imageUrl: string,
    ingredients: Ingredients[],
    tags: String[],
    steps: String[],
    calories: string,
    time: string
  ) {
    let generatedId: string;
    let fetchedUserId: string;
    let newRecepie: Recepie;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        if (!fetchedUserId) {
          throw new Error('No user found!');
        }
        newRecepie = new Recepie(
          Math.random().toString(),
          title,
          description,
          imageUrl,
          fetchedUserId,
          ingredients,
          tags,
          steps,
          calories,
          time
        );
        return this.http.post<{ name: string }>(
          `https://ionic-angular-project-83cb0.firebaseio.com/recepies.json?auth=${token}`,
          {
            ...newRecepie,
            id: null
          }
        );
      }),
      switchMap(resData => {
        generatedId = resData.name;
        return this.recepies;
      }),
      take(1),
      tap(recepies => {
        newRecepie.id = generatedId;
        this._recepies.next(recepies.concat(newRecepie));
      })
    );

  }

  fetchRecepies() {
    return this.authService.token.pipe(take(1),switchMap(token => {
      return this.http
      .get<{ [key: string]: RecepieData }>(
        `https://ionic-angular-project-83cb0.firebaseio.com/recepies.json?auth=${token}`
      )
    }),
        map(resData => {
          const recepies = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              
              recepies.push(
                new Recepie(
                  key,
                  resData[key].title,
                  resData[key].description,
                  resData[key].imageUrl,
                  resData[key].userId,
                  resData[key].ingredients,
                  resData[key].tags,
                  resData[key].steps,
                  resData[key].calories,
                  resData[key].time
                )
              );
            }
          }
          return recepies;
          // return [];
        }),
        tap(recepies => {
          this._recepies.next(recepies);
        })
      );
  }

  updateRecepie(recepieId: string, title: string, description: string,imageUrl: string ,ingredients: Ingredients[], tags: String[]
    ,steps: String[], calories: string, time: string) {
    let updatedRecepies: Recepie[];
    let fetchedToken: string;
    return this.authService.token.pipe(take(1),switchMap(token => {
      fetchedToken = token;
      return this.recepies;
    }),
      take(1),
      switchMap(recepies => {
        if (!recepies || recepies.length <= 0) {
          return this.fetchRecepies();
        } else {
          return of(recepies);
        }
      }),
      switchMap(recepies => {
        const updatedRecepieIndex = recepies.findIndex(rec => rec.id === recepieId);
        updatedRecepies = [...recepies];
        const oldRecepie = updatedRecepies[updatedRecepieIndex];
        updatedRecepies[updatedRecepieIndex] = new Recepie(
          oldRecepie.id,
          title,
          description,
          imageUrl,
          oldRecepie.userId,
          ingredients,
          tags,
          steps,
          calories,
          time
        );
        return this.http.put(
          `https://ionic-angular-project-83cb0.firebaseio.com/recepies/${recepieId}.json?auth=${fetchedToken}`,
          { ...updatedRecepies[updatedRecepieIndex], id: null }
        );
      }),
      tap(() => {
        this._recepies.next(updatedRecepies);
      })
    );
  }

 

 
}
