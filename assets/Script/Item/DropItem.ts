import { Item } from "db://assets/Script/Item/Item";

/**
 * 物品掉落
 */
export class DropItem {
    /**
     * 物品
     */
    readonly item: Item;

    /**
     * 物品掉落概率
     */
    readonly dropRate: number = 1;

    /**
     * 最大数量
     */
    readonly max: number = 1;

    /**
     * 最小数量
     */
    readonly min: number = 1;

    /**
     * 一次性掉落
     */
    readonly once: boolean = false;

    constructor(item: Item, dropRate: number, max: number, min: number, once: boolean) {
        this.item = item;
        this.dropRate = dropRate;
        this.max = max;
        this.min = min;
        this.once = once;
    }
}

