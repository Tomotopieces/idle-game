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
    private readonly _id: number;

    /**
     * 名称
     */
    private readonly _name: string;

    /**
     * 类型
     */
    private readonly _type: ItemType;

    /**
     * 描述
     */
    private readonly _description: string;

    constructor(id: number, name: string, type: ItemType, description: string) {
        this._id = id;
        this._name = name;
        this._type = type;
        this._description = description;
    }

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
     * 物品ID
     */
    itemId: number;

    /**
     * 数量
     */
    count: number;

    constructor(itemId: number, count: number) {
        this.itemId = itemId;
        this.count = count;
    }

    /**
     * 从对象创建
     * @param obj
     */
    static fromObject(obj: any): ItemStack {
        return new ItemStack(obj.itemId, obj.count);
    }
}
