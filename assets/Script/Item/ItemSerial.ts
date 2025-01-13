import { Item } from "db://assets/Script/Item/Item";
import { ItemFactory } from "db://assets/Script/Item/ItemFactory";
import { ITEM_META_TABLE } from "db://assets/Script/DataTable";

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

    /**
     * 从Object创建
     *
     * @param object Object
     */
    static fromObject(object: ItemSerial): ItemSerial {
        return new ItemSerial(object.name);
    }

    /**
     * 反序列化
     */
    deserialize(): Item {
        return ItemFactory.item(ITEM_META_TABLE.get(this.name));
    }
}