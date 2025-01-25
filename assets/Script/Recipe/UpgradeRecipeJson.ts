import { UpgradeRecipe } from "db://assets/Script/Recipe/UpgradeRecipe";
import { RecipeRequirementJson } from "db://assets/Script/Recipe/RecipeRequirementJson";
import { ITEM_META_TABLE } from "db://assets/Script/DataTable";

import { ItemRarity } from "db://assets/Script/Item/ItemRarity";
import { EquipmentMeta } from "db://assets/Script/Equipment/EquipmentMeta";
import { ItemFactory } from "db://assets/Script/Item/ItemFactory";

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
    readonly outputName: string;

    /**
     * 产出品质
     */
    readonly outputRarity: ItemRarity;

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
        const itemMeta = ITEM_META_TABLE.get(recipeJson.outputName);
        if (!itemMeta) {
            console.error(`[UpgradeRecipeJson.toUpgradeRecipe] no such item meta: ${recipeJson.outputName}`);
        }
        return new UpgradeRecipe(id, ItemFactory.create(itemMeta as EquipmentMeta), recipeJson.outputRarity, requirements);
    }
}