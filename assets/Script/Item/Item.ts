/**
 * 物品类型
 */
export enum ItemType {
    /**
     * 常规项
     */
    COMMON,

    /**
     * 装备
     */
    EQUIPMENT,

    /**
     * 消耗品
     */
    CONSUMABLE,
}

/**
 * 物品
 *
 * 从文件中读取，readonly
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

    /**
     * 图标
     */
    private readonly _icon: string;

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

    get icon(): string {
        return this._icon;
    }
}

