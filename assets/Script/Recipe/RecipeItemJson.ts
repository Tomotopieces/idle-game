import { RecipeItem } from "db://assets/Script/Recipe/RecipeItem";
import { ITEM_TABLE } from "db://assets/Script/DataTable";

/**
 * 配方材料JSON
 */
export class RecipeItemJson {
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
     * @return RecipeItem
     */
    static toRecipeItem(requirementJson: RecipeItemJson): RecipeItem {
        return new RecipeItem(ITEM_TABLE.get(requirementJson.itemName), requirementJson.count, requirementJson.consume);
    }
}