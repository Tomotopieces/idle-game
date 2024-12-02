import { Item } from "db://assets/Script/Item/Item";

/**
 * 物品掉落
 */
export class DropItem {
    /**
     * 物品
     */
    private _item: Item;

    /**
     * 物品掉落概率
     */
    private _dropRate: number = 1;

    /**
     * 最大数量
     */
    private _max: number = 1;

    /**
     * 最小数量
     */
    private _min: number = 1;

    constructor(item: Item, dropRate: number, max: number, min: number) {
        this._item = item;
        this._dropRate = dropRate;
        this._max = max;
        this._min = min;
    }

    get item(): Item {
        return this._item;
    }

    set item(value: Item) {
        this._item = value;
    }

    get dropRate(): number {
        return this._dropRate;
    }

    set dropRate(value: number) {
        this._dropRate = value;
    }

    get max(): number {
        return this._max;
    }

    set max(value: number) {
        this._max = value;
    }

    get min(): number {
        return this._min;
    }

    set min(value: number) {
        this._min = value;
    }
}

