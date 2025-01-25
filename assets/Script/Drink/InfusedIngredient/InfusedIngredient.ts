import { Item } from "db://assets/Script/Item/Item";
import { InfusedIngredientMeta } from "db://assets/Script/Drink/InfusedIngredient/InfusedIngredientMeta";
import { UniqueUtility } from "db://assets/Script/Equipment/UniqueUtility/UniqueUtility";

/**
 * 泡酒物
 */
export class InfusedIngredient extends Item {
    declare meta: InfusedIngredientMeta;

    constructor(meta: InfusedIngredientMeta, uuid?: string) {
        super(meta, uuid);
    }

    get drinkEffect(): UniqueUtility {
        return this.meta.drinkEffect;
    }
}