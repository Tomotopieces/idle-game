import { ItemStack } from "db://assets/Script/Item/ItemStack";

import { ITEM_META_TABLE } from "db://assets/Script/DataTable";
import { ItemFactory } from "db://assets/Script/Item/ItemFactory";
import { ItemSerial } from "db://assets/Script/Item/ItemSerial";

/**
 * 物品堆叠序列化对象
 */
export class ItemStackSerial {
    /**
     * 物品JSON
     */
    itemSerial: ItemSerial;

    /**
     * 数量
     */
    count: number;

    constructor(stack: ItemStack) {
        this.itemSerial = ItemFactory.serialize(stack.item);
        this.count = stack.count;
    }

    /**
     * 反序列化
     *
     * @param stackSerial ItemStackSerial
     */
    static deserialize(stackSerial: ItemStackSerial): ItemStack {
        return ItemFactory.itemStack(ITEM_META_TABLE.get(stackSerial.itemSerial.name), stackSerial.count);
    }
}