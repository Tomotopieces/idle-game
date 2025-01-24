import { Item } from "db://assets/Script/Item/Item";

/**
 * 物品序列化
 */
export class ItemSerial {
    /**
     * 名称
     */
    readonly name: string;

    constructor(item: Item | string) {
        this.name = item instanceof Item ? item.name : item;
    }
}