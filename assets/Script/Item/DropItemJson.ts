import { DropItem } from "db://assets/Script/Item/DropItem";

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
    private readonly _dropRate: number = 1;

    /**
     * 最大数量
     */
    private readonly _max: number = 1;

    /**
     * 最小数量
     */
    private readonly _min: number = 1;

    /**
     * 一次性掉落
     */
    private readonly _once: boolean = false;

    constructor(itemName: string, dropRate: number, max: number, min: number, once: boolean) {
        this._itemName = itemName;
        this._dropRate = dropRate;
        this._max = max;
        this._min = min;
        this._once = once;
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