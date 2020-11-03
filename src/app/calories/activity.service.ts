import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { take, switchMap, map, tap } from 'rxjs/operators';
import { ShoppingListItem } from '../ingredients/shopping-list-item.model';
import { BehaviorSubject } from 'rxjs';
import { Activity } from './activity.model';



interface Data {
  calories: number 
  userId: string
}



@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  private _items = new BehaviorSubject<Activity []>([]);


    constructor(private authService: AuthService, private http: HttpClient) {        
    }

    get items() {
      return this._items.asObservable();
    }

    addItem(calories: number) {
            let generatedId: string;
            let newItem: Activity;
            let fetchedUserId: string;
            return this.authService.userId.pipe(take(1), switchMap(userId => {
                if(!userId) {
                    throw new Error('No user id found.');
                }
                fetchedUserId = userId;
                return this.authService.token;

            }),take(1),
            switchMap(token => {
              newItem = new Activity(Math.random().toString(),calories,fetchedUserId);

                return this.http.post<{name:string}>(`https://ionic-angular-project-83cb0.firebaseio.com/activities.json?auth=${token}`,
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
          `https://ionic-angular-project-83cb0.firebaseio.com/activities.json?&auth=${token}`
        );
      }),
      map(itemData => {
        const items = [];
        for (const key in itemData) {
          if (itemData.hasOwnProperty(key) && itemData[key].userId === fetchedUserId) {
            items.push(
              new Activity(
                key,
                itemData[key].calories,
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
