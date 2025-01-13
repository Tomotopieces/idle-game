import { RecipeRequirement } from "db://assets/Script/Recipe/RecipeRequirement";
import { ITEM_META_TABLE } from "db://assets/Script/DataTable";

/**
 * 配方材料JSON
 */
export class RecipeRequirementJson {
    /**
     * 物品名称
     */
    readonly itemName: string;

    /**
     * 需求数量
     */
    readonly count: number;

    /**
     * 是否消耗
     */
    readonly consume: boolean;

    /**
     * 转换为RecipeItem
     *
     * @param requirementJson RecipeItemJson
     * @return RecipeRequirement
     */
    static toRecipeItem(requirementJson: RecipeRequirementJson): RecipeRequirement {
        return new RecipeRequirement(ITEM_META_TABLE.get(requirementJson.itemName), requirementJson.count, requirementJson.consume);
    }
}