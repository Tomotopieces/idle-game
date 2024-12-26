import { Item, ItemRarity, RARITIES } from "db://assets/Script/Item/Item";
import { RecipeRequirement } from "db://assets/Script/Recipe/RecipeRequirement";
import { Recipe } from "db://assets/Script/Recipe/Recipe";

/**
 * 升阶配方
 */
export class UpgradeRecipe extends Recipe {
    /**
     * 需求品质
     */
    readonly requireRarity: ItemRarity;

    /**
     * 产出品质
     */
    readonly productRarity: ItemRarity;

    constructor(id: number, product: Item, productRarity: ItemRarity, requirements: RecipeRequirement[]) {
        super(id, product, requirements);
        this.productRarity = productRarity;
        this.requireRarity = RARITIES[RARITIES.indexOf(productRarity) - 1];
    }
}