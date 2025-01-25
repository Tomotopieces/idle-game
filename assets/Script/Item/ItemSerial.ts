import { Item } from "db://assets/Script/Item/Item";
import { ItemMeta } from "db://assets/Script/Item/ItemMeta";

/**
 * 物品序列化
 */
export class ItemSerial {
    /**
     * 名称
     */
    readonly name: string;

    /**
     * 唯一标识符
     */
    readonly uuid: string;

    constructor(item: Item | string) {
        this.name = item instanceof Item ? item.name : item;
    }

    /**
     * 反序列化
     *
     * @param meta   元数据
     * @param serial 序列化数据
     */
    static deserialize(meta: ItemMeta, serial: ItemSerial): Item {
        return new Item(meta, serial.uuid);
    }
}