import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { map, take, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Calories } from './calories.model';
import { Ingredients } from '../ingredients/ingredients.model';
import { ShoppingListItem } from '../ingredients/shopping-list-item.model';


interface Data {
    calories: string
    recepieImage: string
    recepieName: string
    date: Date
    userId: string
}


@Injectable({providedIn: 'root'})
export class CalorieService {
    private _items = new BehaviorSubject<Calories []>([]);


    constructor(private authService: AuthService, private http: HttpClient) {        
    }

    get items() {
      return this._items.asObservable();
    }

    addItem(recepieName: string, calories: string,recepieImg: string) {
            let generatedId: string;
            let newItem: Calories;
            let fetchedUserId: string;
            return this.authService.userId.pipe(take(1), switchMap(userId => {
                if(!userId) {
                    throw new Error('No user id found.');
                }
                fetchedUserId = userId;
                return this.authService.token;

            }),take(1),
            switchMap(token => {
              newItem = new Calories(Math.random().toString(), recepieName,calories, recepieImg ,new Date() ,fetchedUserId);

                return this.http.post<{name:string}>(`https://ionic-angular-project-83cb0.firebaseio.com/calories.json?auth=${token}`,
            {...newItem, id:null});
            }),
            switchMap(resData => {
                generatedId = resData.name;
                return this.items;
            }),take(1),tap(items => {
                newItem.id = generatedId;
                this._items.next(items.concat(newItem));
            }));
    }

    cancelItem(itemId: string) {
        return this.authService.token.pipe(take(1), switchMap(token => {
          return this.http.delete(`https://ionic-angular-project-83cb0.firebaseio.com/calories/${itemId}.json?auth=${token}`);  
        }),switchMap(()=> {
            return this.items;
        }),take(1),tap(items => {
            this._items.next(items.filter(i => i.id !== itemId));
        }));             
    }

    fetchItems() {
      let fetchedUserId: string;
      return this.authService.userId.pipe(
        take(1),
        switchMap(userId => {
          if (!userId) {
            throw new Error('User not found!');
          }
          fetchedUserId = userId;
          return this.authService.token;
          
        }),
        take(1),
        switchMap(token => {
          return this.http.get<{ [key: string]: Data }>(
            `https://ionic-angular-project-83cb0.firebaseio.com/calories.json?&auth=${token}`
          );
        }),
        map(itemData => {
          const items = [];
          for (const key in itemData) {
            if (
                itemData.hasOwnProperty(key) &&
                itemData[key].userId === fetchedUserId &&
                new Date().getTime() - new Date(itemData[key].date).getTime() <
                  24*60 *60*1000
              ) {
                items.push(
                  new Calories(
                    key,
                    itemData[key].recepieName,
                    itemData[key].calories,
                    itemData[key].recepieImage,
                    new Date(itemData[key].date),
                    itemData[key].userId
                  )
                );
              }
          }
          return items;
        }),
        tap(items => {
          this._items.next(items);
        })
      );
    }
}