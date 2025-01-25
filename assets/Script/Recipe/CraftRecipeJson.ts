import { RecipeRequirementJson } from "db://assets/Script/Recipe/RecipeRequirementJson";
import { CraftRecipe } from "db://assets/Script/Recipe/CraftRecipe";
import { ITEM_META_TABLE } from "db://assets/Script/DataTable";
import { ItemFactory } from "db://assets/Script/Item/ItemFactory";

/**
 * 配方JSON
 */
export class CraftRecipeJson {
    /**
     * 产物名称
     */
    readonly outputName: string;

    /**
     * 需求
     */
    readonly requirements: RecipeRequirementJson[];

    /**
     * 转换为CraftRecipe
     *
     * @param id         ID
     * @param recipeJson CraftRecipeJson
     * @return CraftRecipe
     */
    static toCraftRecipe(id: number, recipeJson: CraftRecipeJson): CraftRecipe {
        const item = ItemFactory.create(ITEM_META_TABLE.get(recipeJson.outputName));
        return new CraftRecipe(id, item, recipeJson.requirements.map(requirement => RecipeRequirementJson.toRecipeItem(requirement)));
    }
}