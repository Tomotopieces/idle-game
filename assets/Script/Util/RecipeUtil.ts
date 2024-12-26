import { CraftRecipe } from "db://assets/Script/Recipe/CraftRecipe";
import { Storehouse } from "db://assets/Script/Storehouse/Storehouse";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { RecipeRequirement } from "db://assets/Script/Recipe/RecipeRequirement";
import { CRAFT_RECIPE_TABLE, UPGRADE_RECIPE_LIST } from "db://assets/Script/DataTable";
import { UpgradeRecipe } from "db://assets/Script/Recipe/UpgradeRecipe";
import { Equipment } from "db://assets/Script/Item/Equipment/Equipment";

/**
 * 配方工具
 */
export class RecipeUtil {
    /**
     * 可用的铸造配方列表
     */
    static availableCraftRecipes(): CraftRecipe[] {
        return Array.from(CRAFT_RECIPE_TABLE.values()).filter(recipe => this.canProduce(recipe));
    }

    /**
     * 可用的升阶配方列表
     */
    static availableUpgradeRecipes(): UpgradeRecipe[] {
        return UPGRADE_RECIPE_LIST.filter(recipe => !!Storehouse.countOne(recipe.product) &&
            recipe.requireRarity === (recipe.product as Equipment).attributes.rarity);
    }

    /**
     * 检查是否满足配方需求
     *
     * @param recipe 配方
     */
    static checkRequirements(recipe: CraftRecipe): boolean {
        return Storehouse.check(this.requirementsToStacks(recipe.requirements));
    }

    /**
     * 检查产物是否能铸造
     *
     * @param recipe 配方
     * @return 是否能铸造
     */
    static canProduce(recipe: CraftRecipe): boolean {
        return !recipe.product.unique || !Storehouse.countOne(recipe.product); // 非唯一，或不存在
    }

    /**
     * 披挂铸造
     *
     * @param recipe 配方
     * @returns 成功与否
     */
    static craft(recipe: CraftRecipe): boolean {
        const requirements = recipe.requirements.filter(requirement => requirement.consume);
        if (Storehouse.tackOut(this.requirementsToStacks(requirements))) {
            Storehouse.putIn([new ItemStack(recipe.product, 1)]);
            return true;
        }
        return false;
    }

    /**
     * 披挂升阶
     *
     * @param recipe 配方
     * @return 成功与否
     */
    static upgrade(recipe: UpgradeRecipe): boolean {
        const requirements = recipe.requirements.filter(requirement => requirement.consume);
        if (Storehouse.tackOut(this.requirementsToStacks(requirements))) {
            (recipe.product as Equipment).attributes.upgrade();
            return true;
        }
    }

    /**
     * 将配方需求转换为物品堆叠
     *
     * @param requirements 配方需求列表
     * @return 物品堆叠列表
     */
    private static requirementsToStacks(requirements: RecipeRequirement[]): ItemStack[] {
        return requirements.map(requirement => new ItemStack(requirement.item, requirement.count));
    }
}