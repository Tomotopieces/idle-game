import { ItemMeta } from "db://assets/Script/Item/ItemMeta";
import { UniqueUtility } from "db://assets/Script/Equipment/UniqueUtility/UniqueUtility";

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
    readonly drinkEffect: UniqueUtility;

    constructor(meta: ItemMeta, healthRecoverRatio: number, ingredientCapacity: number, drinkEffect: UniqueUtility) {
        super(meta.id, meta.name, meta.displayName, meta.itemType, meta.description, meta.icon, meta.unique, meta.rarity);
        this.healthRecoverRatio = healthRecoverRatio;
        this.ingredientCapacity = ingredientCapacity;
        this.drinkEffect = drinkEffect;
    }
}