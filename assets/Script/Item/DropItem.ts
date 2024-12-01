import { Item, ItemStack } from "db://assets/Script/Item/Item";
import { GlobalStateName } from "db://assets/Script/Util/Constant";
import { GlobalState } from "db://assets/Script/Util/GlobalState";

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

export class JsonDropItem {
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
     */
    public static toDropItem(jsonDropItem: JsonDropItem): DropItem {
        jsonDropItem = JsonDropItem.fromObj(jsonDropItem);
        const item = GlobalState.getState(GlobalStateName.ITEM_TABLE).get(jsonDropItem._itemId);
        return new DropItem(item, jsonDropItem._dropRate, jsonDropItem._max, jsonDropItem._min);
    }

    /**
     * 从Object对象重新创建JsonDropItem
     */
    static fromObj(drop: any) {
        return new JsonDropItem(drop.itemId, drop.dropRate, drop.max, drop.min);
    }
}

/**
 * 物品掉落工厂
 */
export class DropItemFactory {
    /**
     * 根据掉落列表生成物品
     *
     * @param dropList 掉落列表
     */
    public static produce(dropList: Array<DropItem>): Array<ItemStack> {
        const result = new Array<ItemStack>();
        dropList.forEach(drop => {
            if (Math.random() < drop.dropRate) {
                result.push((new ItemStack(drop.item.id, Math.floor(Math.random() * (drop.max - drop.min + 1) + drop.min))));
            }
        });
        return result;
    }
}
