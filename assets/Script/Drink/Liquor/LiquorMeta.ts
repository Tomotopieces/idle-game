import { ItemMeta } from "db://assets/Script/Item/ItemMeta";
import { PassiveEffect } from "db://assets/Script/PassiveEffect/PassiveEffect";

/**
 * 酒元数据
 */
export class LiquorMeta extends ItemMeta {
    /**
     * 生命恢复量
     *
     * 百分比值，0~1
     */
    readonly healthRecoverRatio: number;

    /**
     * 泡酒物容量
     */
    readonly ingredientCapacity: number;

    /**
     * 饮用效果
     */
    readonly effect: PassiveEffect;

    constructor(meta: ItemMeta, healthRecoverRatio: number, ingredientCapacity: number, drinkEffect: PassiveEffect) {
        super(meta.id, meta.name, meta.displayName, meta.itemType, meta.description, meta.icon, meta.unique, meta.rarity);
        this.healthRecoverRatio = healthRecoverRatio;
        this.ingredientCapacity = ingredientCapacity;
        this.effect = drinkEffect;
    }
}