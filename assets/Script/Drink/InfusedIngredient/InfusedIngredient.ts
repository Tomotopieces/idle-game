import { Item } from "db://assets/Script/Item/Item";
import { InfusedIngredientMeta } from "db://assets/Script/Drink/InfusedIngredient/InfusedIngredientMeta";
import { UniqueUtility } from "db://assets/Script/Equipment/UniqueUtility/UniqueUtility";

/**
 * 泡酒物
 */
export class InfusedIngredient extends Item {
    readonly meta: InfusedIngredientMeta;

    constructor(meta: InfusedIngredientMeta) {
        super(meta);
        this.meta = meta;
    }

    get drinkEffect(): UniqueUtility {
        return this.meta.drinkEffect;
    }
}