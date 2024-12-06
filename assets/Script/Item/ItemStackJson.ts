import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { GlobalStateName } from "db://assets/Script/Util/Constant";
import { ItemStack } from "db://assets/Script/Item/ItemStack";
import { Item } from "db://assets/Script/Item/Item";

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
        const itemTable = GlobalState.getState(GlobalStateName.ITEM_TABLE) as Map<string, Item>;
        const item = itemTable.get(itemStack.itemName);
        return new ItemStack(item, itemStack.count);
    }
}