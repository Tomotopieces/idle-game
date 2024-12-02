import { GlobalState } from "db://assets/Script/Util/GlobalState";
import { GlobalStateName } from "db://assets/Script/Util/Constant";
import { DropItem } from "db://assets/Script/Item/DropItem";

/**
 * 掉落物品JSON
 */
export class DropItemJson {
    /**
     * 物品ID
     */
    private readonly _itemId: number;

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

    constructor(itemId: number, dropRate: number, max: number, min: number) {
        this._itemId = itemId;
        this._dropRate = dropRate;
        this._max = max;
        this._min = min;
    }

    /**
     * 转换为DropItem
     *
     * @param jsonDropItem DropItemJson
     */
    static toDropItem(jsonDropItem: DropItemJson): DropItem {
        jsonDropItem = DropItemJson.fromObject(jsonDropItem);
        const item = GlobalState.getState(GlobalStateName.ITEM_TABLE).get(jsonDropItem._itemId);
        return new DropItem(item, jsonDropItem._dropRate, jsonDropItem._max, jsonDropItem._min);
    }

    /**
     * 从Object对象重新创建
     *
     * @param obj Object
     */
    static fromObject(obj: any) {
        return new DropItemJson(obj.itemId, obj.dropRate, obj.max, obj.min);
    }
}