import { CraftRecipe } from "db://assets/Script/Recipe/CraftRecipe";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { Storehouse } from "db://assets/Script/Storehouse/Storehouse";
import { RecipeRequirement } from "db://assets/Script/Recipe/RecipeRequirement";

/**
 * 配方工具
 */
export class RecipeUtil {
    /**
     * 检查是否满足配方需求
     *
     * @param recipe 配方
     */
    static checkRequirements(recipe: CraftRecipe): boolean {
        return Storehouse.check(this.requirementsToStacks(recipe.requirements));
    }

    /**
     * 检查产物是否还能继续制作
     *
     * @param recipe 配方
     * @return 是否还能继续制作
     */
    static checkProduct(recipe: CraftRecipe): boolean {
        return !recipe.product.unique || !Storehouse.countOne(recipe.product); // 非唯一，或不存在
    }

    /**
     * 铸造物品
     *
     * @param recipe 配方
     * @returns 产物
     */
    static craft(recipe: CraftRecipe): void {
        const requirements = recipe.requirements.filter(requirement => requirement.consume);
        if (Storehouse.tackOut(this.requirementsToStacks(requirements))) {
            Storehouse.putIn([new ItemStack(recipe.product, 1)]);
        }
    }

    /**
     * 将配方需求转换为物品堆叠
     *
     * @param requirements 配方需求列表
     * @return 物品堆叠列表
     */
    private static requirementsToStacks(requirements: Array<RecipeRequirement>): Array<ItemStack> {
        return requirements.map(requirement => new ItemStack(requirement.item, requirement.count));
    }
}
