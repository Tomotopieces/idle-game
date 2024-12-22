import { RecipeItem } from "db://assets/Script/Recipe/RecipeItem";
import { Item } from "db://assets/Script/Item/Item";

/**
 * 铸造配方
 */
export class CraftRecipe {
    readonly id: number;

    /**
     * 产物
     */
    readonly product: Item;

    /**
     * 需求
     */
    readonly requirements: Array<RecipeItem>;

    constructor(id: number, product: Item, requirements: Array<RecipeItem>) {
        this.id = id;
        this.product = product;
        this.requirements = requirements;
    }
}