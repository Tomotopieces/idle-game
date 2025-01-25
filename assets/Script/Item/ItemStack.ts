import { Item } from "db://assets/Script/Item/Item";
import { ItemStackSerial } from "db://assets/Script/Item/ItemStackSerial";
import { ItemMeta } from "db://assets/Script/Item/ItemMeta";
import { ITEM_META_TABLE } from "db://assets/Script/DataTable";
import { ItemFactory } from "db://assets/Script/Item/ItemFactory";

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
     * 通过元数据生产新物品堆叠
     *
     * @param data  元数据 | 物品 | 名称
     * @param count 堆叠数量
     * @return {ItemStack} 物品堆叠
     */
    static of<Meta extends ItemMeta>(data: Meta | Item | string, count: number): ItemStack {
        const item =
            data instanceof ItemMeta ? ItemFactory.create(data) :
            data instanceof Item ? data :
            ItemFactory.create(ITEM_META_TABLE.get(data));
        return new ItemStack(item, count) as ItemStack;
    }

    /**
     * 序列化
     */
    serialize(): ItemStackSerial {
        return new ItemStackSerial(this);
    }
}