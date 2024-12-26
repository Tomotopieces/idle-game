import { RecipeRequirementJson } from "db://assets/Script/Recipe/RecipeRequirementJson";
import { CraftRecipe } from "db://assets/Script/Recipe/CraftRecipe";
import { ITEM_TABLE } from "db://assets/Script/DataTable";

/**
 * 配方JSON
 */
export class CraftRecipeJson {
    /**
     * 产物名称
     */
    readonly productName: string;

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
        return new CraftRecipe(id, ITEM_TABLE.get(recipeJson.productName), recipeJson.requirements.map(requirement => RecipeRequirementJson.toRecipeItem(requirement)));
    }
}