import { Item } from "db://assets/Script/Item/Item";
import { ITEM_TABLE } from "db://assets/Script/DataTable";

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

    /**
     * 通过物品名称构造
     *
     * @param itemName 物品名称
     * @param count    物品数量
     * @returns 物品堆叠
     */
    static of(itemName: string, count: number): ItemStack {
        return new ItemStack(ITEM_TABLE.get(itemName), count);
    }
}