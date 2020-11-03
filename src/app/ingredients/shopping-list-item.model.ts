import { Ingredients } from './ingredients.model';

export class ShoppingListItem {
    constructor(public id: string, public ingredient: Ingredients, public userId: string) {}
}