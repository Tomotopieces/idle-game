import { ItemStack } from "db://assets/Script/Item/ItemStack";
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
     * @param serial 序列化数据
     * @return {ItemStack} 物品堆叠
     */
    static deserialize(serial: ItemStackSerial): ItemStack {
        return ItemStack.of(ItemFactory.deserialize(serial.itemSerial), serial.count);
    }
}