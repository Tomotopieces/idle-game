import { ItemStack } from "db://assets/Script/Item/ItemStack";

import { ITEM_TABLE } from "db://assets/Script/DataTable";

/**
 * 物品堆叠JSON
 */
export class ItemStackJson {
    /**
     * 物品名称
     */
    itemName: string;

    /**
     * 数量
     */
    count: number;

    constructor(itemName: string, count: number) {
        this.itemName = itemName;
        this.count = count;
    }

    /**
     * 转为ItemStack
     *
     * @param itemStack ItemStack
     */
    static toItemStack(itemStack: ItemStackJson): ItemStack {
        const item = ITEM_TABLE.get(itemStack.itemName);
        return new ItemStack(item, itemStack.count);
    }
}