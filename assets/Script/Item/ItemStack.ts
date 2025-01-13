import { Item } from "db://assets/Script/Item/Item";
import { ItemStackSerial } from "db://assets/Script/Item/ItemStackSerial";

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

    /**
     * 新物品请使用 ItemFactory.itemStack 方法创建
     */
    constructor(item: Item, count: number) {
        this.item = item;
        this.count = count;
    }

    /**
     * 序列化
     */
    serialize(): ItemStackSerial {
        return new ItemStackSerial(this);
    }
}