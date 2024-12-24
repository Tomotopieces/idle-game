import { ItemRarity } from "db://assets/Script/Item/Item";
import { RecipeRequirement } from "db://assets/Script/Recipe/RecipeRequirement";
import { Equipment } from "db://assets/Script/Item/Equipment/Equipment";

/**
 * 升阶配方
 */
export class UpgradeRecipe {
    /**
     * ID
     */
    readonly id: number;

    /**
     * 目标装备
     */
    readonly equipment: Equipment;

    /**
     * 产出品质
     */
    readonly productRarity: ItemRarity;

    /**
     * 需求
     */
    readonly requirements: Array<RecipeRequirement>;

    constructor(id: number, equipment: Equipment, productRarity: ItemRarity, requirements: Array<RecipeRequirement>) {
        this.id = id;
        this.equipment = equipment;
        this.productRarity = productRarity;
        this.requirements = requirements;
    }
}