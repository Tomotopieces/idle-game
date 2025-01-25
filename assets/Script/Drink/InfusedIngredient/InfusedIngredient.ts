import { Item } from "db://assets/Script/Item/Item";
import { InfusedIngredientMeta } from "db://assets/Script/Drink/InfusedIngredient/InfusedIngredientMeta";
import { PassiveEffect } from "db://assets/Script/PassiveEffect/PassiveEffect";

/**
 * 泡酒物
 */
export class InfusedIngredient extends Item {
    declare meta: InfusedIngredientMeta;

    constructor(meta: InfusedIngredientMeta, uuid?: string) {
        super(meta, uuid);
    }

    get effect(): PassiveEffect {
        return this.meta.effect;
    }
}