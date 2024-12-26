import { Item } from "db://assets/Script/Item/Item";
import { RecipeRequirement } from "db://assets/Script/Recipe/RecipeRequirement";

/**
 * 抽象配方
 */
export abstract class Recipe {
    /**
     * ID
     */
    readonly id: number;

    /**
     * 产物
     */
    readonly product: Item;

    /**
     * 需求
     */
    readonly requirements: RecipeRequirement[];

    protected constructor(id: number, product: Item, requirements: RecipeRequirement[]) {
        this.id = id;
        this.product = product;
        this.requirements = requirements;
    }
}