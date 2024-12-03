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
 */
export class Item {
    /**
     * ID
     */
    private readonly _id: number;

    /**
     * 名称
     *
     * 数据关联用
     *
     * 英语/拼音小写，下划线分词
     */
    private readonly _name: string;

    /**
     * 展示名称
     */
    private readonly _displayName: string;

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

    constructor(id: number, name: string, displayName: string, type: ItemType, description: string, icon: string) {
        this._id = id;
        this._name = name;
        this._displayName = displayName;
        this._type = type;
        this._description = description;
        this._icon = icon;
    }

    /**
     * 从Object创建
     *
     * @param object Object
     * @return Item
     */
    static fromObject(object: any): Item {
        return new Item(object.id, object.name, object.displayName, object.type, object.description, object.icon);
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get displayName(): string {
        return this._displayName;
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

