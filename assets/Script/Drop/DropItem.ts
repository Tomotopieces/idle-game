import { ItemMeta } from "db://assets/Script/Item/ItemMeta";

/**
 * 物品掉落
 */
export class DropItem {
    /**
     * 物品
     */
    readonly itemMeta: ItemMeta;

    /**
     * 物品掉落概率
     *
     * 百分比值，0~1
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
     *
     * 无视概率，必定掉落
     */
    readonly once: boolean = false;

    constructor(itemMeta: ItemMeta, dropRate: number, max: number, min: number, once: boolean) {
        this.itemMeta = itemMeta;
        this.dropRate = dropRate;
        this.max = max;
        this.min = min;
        this.once = once;
    }
}
