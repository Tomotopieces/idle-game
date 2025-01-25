import { Item } from "db://assets/Script/Item/Item";
import { ItemMeta } from "db://assets/Script/Item/ItemMeta";

/**
 * 物品序列化
 */
export class ItemSerial {
    /**
     * 唯一标识符
     */
    readonly uuid: string;

    /**
     * 名称
     */
    readonly name: string;

    constructor(item: Item) {
        this.uuid = item.uuid;
        this.name = item.name;
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