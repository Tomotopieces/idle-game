import { CraftRecipe } from "db://assets/Script/Recipe/CraftRecipe";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { Storehouse } from "db://assets/Script/Storehouse/Storehouse";
import { RecipeItem } from "db://assets/Script/Recipe/RecipeItem";

/**
 * 配方工具
 */
export class RecipeUtil {
    /**
     * 检查是否满足配方需求
     *
     * @param recipe 配方
     */
    static check(recipe: CraftRecipe): boolean {
        return Storehouse.check(this.requirementsToStacks(recipe.requirements));
    }

    /**
     * 统计仓库中物品数量
     *
     * @param recipe 配方
     * @return 物品堆叠列表
     */
    static countStorehouse(recipe: CraftRecipe): Array<ItemStack> {
        return Storehouse.count(recipe.requirements.map(requirement => requirement.item));
    }

    /**
     * 铸造物品
     *
     * @param recipe 配方
     * @returns 产物
     */
    static craft(recipe: CraftRecipe): ItemStack {
        return Storehouse.tackOut(this.requirementsToStacks(recipe.requirements)) ? new ItemStack(recipe.product, 1) : null;
    }

    /**
     * 将配方需求转换为物品堆叠
     *
     * @param requirements 配方需求列表
     * @return 物品堆叠列表
     */
    private static requirementsToStacks(requirements: Array<RecipeItem>): Array<ItemStack> {
        return requirements.map(requirement => new ItemStack(requirement.item, requirement.count));
    }
}
