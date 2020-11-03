import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { map, take, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Ingredients } from './ingredients.model';
import { ShoppingListItem } from './shopping-list-item.model';


interface Data {
    ingredient: Ingredients 
    userId: string
}


@Injectable({providedIn: 'root'})
export class IngredientsService {
    private _items = new BehaviorSubject<ShoppingListItem []>([]);


    constructor(private authService: AuthService, private http: HttpClient) {        
    }

    get items() {
      return this._items.asObservable();
    }

    addItem(ingredient: Ingredients) {
            let generatedId: string;
            let newItem: ShoppingListItem;
            let fetchedUserId: string;
            return this.authService.userId.pipe(take(1), switchMap(userId => {
                if(!userId) {
                    throw new Error('No user id found.');
                }
                fetchedUserId = userId;
                return this.authService.token;

            }),take(1),
            switchMap(token => {
              newItem = new ShoppingListItem(Math.random().toString(), ingredient, fetchedUserId);

                return this.http.post<{name:string}>(`https://ionic-angular-project-83cb0.firebaseio.com/shopping-list.json?auth=${token}`,
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
          return this.http.delete(`https://ionic-angular-project-83cb0.firebaseio.com/shopping-list/${itemId}.json?auth=${token}`);  
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
            `https://ionic-angular-project-83cb0.firebaseio.com/shopping-list.json?&auth=${token}`
          );
        }),
        map(itemData => {
          console.log(itemData);
          const items = [];
          for (const key in itemData) {
            if (itemData.hasOwnProperty(key) && itemData[key].userId === fetchedUserId) {
              items.push(
                new ShoppingListItem(
                  key,
                  itemData[key].ingredient,
                  itemData[key].userId,
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