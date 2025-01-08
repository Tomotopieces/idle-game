import { DropItem } from "db://assets/Script/Drop/DropItem";
import { ITEM_TABLE } from "db://assets/Script/DataTable";

/**
 * 掉落物品JSON
 */
export class DropItemJson {
    /**
     * 物品名称
     */
    private readonly _itemName: string;

    /**
     * 物品掉落概率
     */
    private readonly _dropRate: number;

    /**
     * 最大数量
     */
    private readonly _max: number;

    /**
     * 最小数量
     */
    private readonly _min: number;

    /**
     * 一次性掉落
     */
    private readonly _once: boolean;

    constructor(itemName: string, dropRate: number, max: number, min: number, once: boolean) {
        this._itemName = itemName;
        this._dropRate = dropRate ?? 1;
        this._max = max ?? 1;
        this._min = min ?? 1;
        this._once = once ?? false;
    }

    /**
     * 转换为DropItem
     *
     * @param jsonDropItem DropItemJson
     */
    static toDropItem(jsonDropItem: DropItemJson): DropItem {
        jsonDropItem = DropItemJson.fromObject(jsonDropItem);
        const item = ITEM_TABLE.get(jsonDropItem._itemName);
        return new DropItem(item, jsonDropItem._dropRate, jsonDropItem._max, jsonDropItem._min, jsonDropItem._once);
    }

    /**
     * 从Object对象重新创建
     *
     * @param obj Object
     * @return DropItemJson
     */
    static fromObject(obj: any): DropItemJson {
        return new DropItemJson(obj.itemName, obj.dropRate, obj.max, obj.min, obj.once);
    }
}