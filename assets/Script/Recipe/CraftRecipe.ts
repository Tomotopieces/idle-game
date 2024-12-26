import { RecipeRequirement } from "db://assets/Script/Recipe/RecipeRequirement";
import { Item } from "db://assets/Script/Item/Item";
import { Recipe } from "db://assets/Script/Recipe/Recipe";

/**
 * 铸造配方
 */
export class CraftRecipe extends Recipe {
    constructor(id: number, product: Item, requirements: RecipeRequirement[]) {
        super(id, product, requirements);
    }
}