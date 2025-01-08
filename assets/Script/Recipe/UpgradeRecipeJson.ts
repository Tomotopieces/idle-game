import { UpgradeRecipe } from "db://assets/Script/Recipe/UpgradeRecipe";
import { RecipeRequirementJson } from "db://assets/Script/Recipe/RecipeRequirementJson";
import { ITEM_TABLE } from "db://assets/Script/DataTable";
import { Equipment } from "db://assets/Script/Equipment/Equipment";
import { ItemRarity } from "db://assets/Script/Item/Item";

/**
 * 升阶配方JSON
 */
export class UpgradeRecipeJson {
    /**
     * ID
     */
    readonly id: number;

    /**
     * 装备名称
     */
    readonly productName: string;

    /**
     * 目标品质
     */
    readonly productRarity: ItemRarity;

    /**
     * 需求
     */
    readonly requirements: RecipeRequirementJson[];

    /**
     * 转为UpgradeRecipe
     *
     * @param id         ID
     * @param recipeJson UpgradeRecipeJson
     */
    static toUpgradeRecipe(id: number, recipeJson: UpgradeRecipeJson): UpgradeRecipe {
        const requirements = recipeJson.requirements.map(requirement => RecipeRequirementJson.toRecipeItem(requirement));
        return new UpgradeRecipe(id, ITEM_TABLE.get(recipeJson.productName) as Equipment, recipeJson.productRarity, requirements);
    }
}