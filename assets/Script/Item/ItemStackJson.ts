import { ItemStack } from "db://assets/Script/Item/ItemStack";

import { ITEM_TABLE } from "db://assets/Script/DataTable";
import { Equipment } from "db://assets/Script/Equipment/Equipment";

/**
 * 物品堆叠JSON
 */
export class ItemStackJson {
    /**
     * 物品名称
     */
    itemName: string;

    /**
     * 等级
     *
     * TODO 优化披挂类型的等级保存方式
     */
    rank: number;

    /**
     * 数量
     */
    count: number;

    constructor(itemName: string, rank: number, count: number) {
        this.itemName = itemName;
        this.rank = rank;
        this.count = count;
        if (itemName === 'xing_zhe_jie_gu') {
            console.log(`rank: ${rank}`);
        }
    }

    /**
     * 转为ItemStack
     *
     * @param itemStackJson ItemStackJson
     */
    static toItemStack(itemStackJson: ItemStackJson): ItemStack {
        const item = ITEM_TABLE.get(itemStackJson.itemName);
        if (item instanceof Equipment && !!itemStackJson.rank) {
            item.attributes.upgrade(itemStackJson.rank);
        }
        return new ItemStack(item, itemStackJson.count);
    }
}