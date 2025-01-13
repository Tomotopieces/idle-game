import { Item } from "db://assets/Script/Item/Item";
import { RecipeRequirement } from "db://assets/Script/Recipe/RecipeRequirement";
import { Recipe } from "db://assets/Script/Recipe/Recipe";
import { ItemRarity, RARITIES } from "db://assets/Script/Item/ItemRarity";

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
    readonly outputRarity: ItemRarity;

    constructor(id: number, output: Item, outputRarity: ItemRarity, requirements: RecipeRequirement[]) {
        super(id, output, requirements);
        this.outputRarity = outputRarity;
        this.requireRarity = RARITIES[RARITIES.indexOf(outputRarity) - 1];
    }
}