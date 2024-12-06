import { Item } from "db://assets/Script/Item/Item";

/**
 * 物品堆叠
 */
export class ItemStack {
    /**
     * 物品
     */
    item: Item;

    /**
     * 数量
     */
    count: number;

    constructor(item: Item, count: number) {
        this.item = item;
        this.count = count;
    }
}