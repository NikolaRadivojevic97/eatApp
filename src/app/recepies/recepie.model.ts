import { Ingredients } from '../ingredients/ingredients.model';

export class Recepie {
    constructor(public id: string, public title: string, public description: string, 
        public imageUrl: string,
        public userId: string, public ingredients: Ingredients[], 
        public tags: String[], public steps: String[], public calories: string,
        public time: string) {}
}