import { DropItem } from "db://assets/Script/Drop/DropItem";
import { ITEM_META_TABLE } from "db://assets/Script/DataTable";

/**
 * 掉落物品JSON
 */
export class DropItemJson {
    /**
     * 物品名称
     */
    readonly itemName: string;

    /**
     * 物品掉落概率
     */
    readonly dropRate: number;

    /**
     * 最大数量
     */
    readonly max: number;

    /**
     * 最小数量
     */
    readonly min: number;

    /**
     * 一次性掉落
     */
    readonly once: boolean;

    constructor(itemName: string, dropRate: number, max: number, min: number, once: boolean) {
        this.itemName = itemName;
        this.dropRate = dropRate ?? 1;
        this.max = max ?? 1;
        this.min = min ?? 1;
        this.once = once ?? false;
    }

    /**
     * 转换为DropItem
     *
     * @param jsonDropItem DropItemJson
     */
    static toDropItem(jsonDropItem: DropItemJson): DropItem {
        jsonDropItem = DropItemJson.fromObject(jsonDropItem);
        const meta = ITEM_META_TABLE.get(jsonDropItem.itemName);
        return new DropItem(meta, jsonDropItem.dropRate, jsonDropItem.max, jsonDropItem.min, jsonDropItem.once);
    }

    /**
     * 从Object对象重新创建
     *
     * @param object Object
     * @return {DropItemJson} DropItemJson
     */
    static fromObject(object: DropItemJson): DropItemJson {
        return new DropItemJson(object.itemName, object.dropRate, object.max, object.min, object.once);
    }
}