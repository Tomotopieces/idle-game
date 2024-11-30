/**
 * 物品类型
 */
export enum ItemType {
    /**
     * 常规项
     */
    COMMON,

    /**
     * 武器
     */
    WEAPON,

    /**
     * 消耗品
     */
    CONSUMABLE,
}

/**
 * 物品
 */
export class Item {
    /**
     * ID
     */
    private _id: number;

    /**
     * 名称
     */
    private _name: string;

    /**
     * 类型
     */
    private _type: ItemType;

    /**
     * 描述
     */
    private _description: string;


    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get type(): ItemType {
        return this._type;
    }

    get description(): string {
        return this._description;
    }
}

/**
 * 物品堆叠
 */
export class ItemStack {
    /**
     * 物品
     */
    private _item: Item;

    /**
     * 数量
     */
    private _count: number;


    constructor(item: Item, count: number) {
        this._item = item;
        this._count = count;
    }
}
