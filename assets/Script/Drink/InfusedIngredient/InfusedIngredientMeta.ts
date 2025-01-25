import { ItemMeta } from "db://assets/Script/Item/ItemMeta";
import { PassiveEffect } from "db://assets/Script/PassiveEffect/PassiveEffect";

/**
 * 泡酒物元数据
 */
export class InfusedIngredientMeta extends ItemMeta {
    /**
     * 饮用效果
     */
    effect: PassiveEffect;

    constructor(meta: ItemMeta, drinkEffect: PassiveEffect) {
        super(meta.id, meta.name, meta.displayName, meta.itemType, meta.description, meta.icon, meta.unique, meta.rarity);
        this.effect = drinkEffect;
    }
}